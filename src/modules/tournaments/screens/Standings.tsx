import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  SafeAreaView,
  StyleSheet,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/core";
import DropDownPicker, {
  ListModeType,
  ValueType,
} from "react-native-dropdown-picker";
import {
  DataTable,
  FAB,
  Portal,
  TouchableRipple,
  useTheme,
  Dialog,
  Button,
  RadioButton,
  Divider,
  List,
  IconButton,
  ActivityIndicator,
  Modal,
} from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";

import { Block, Dropdown, Text, TextInput } from "../../../components";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getLeagueRegions,
  getLeagueRegionsWithCode,
  getLeagueSeasons,
  getLeagueStandings,
  getStandingsLoading,
  // getStandingsSearchLoading,
  getSearchStandingsByLeague,
  loadRegionsByLeague,
  loadSeasonsByLeague,
  loadStandingsByLeague,
  loadSearchStandingsByLeague,
  resetStandingsLoading,
  submitRecruitMe,
} from "../store";
import { getActiveLeague } from "../../tournaments/store";
import { resolveImage } from "../../../utils";
import * as fromModels from "../models";
import { theme as coreTheme, theme } from "../../../core/theme";
import { clearHeaderSubTitle, setHeaderSubTitle } from "../../common/store";
import { FILTER_REGIONS, indexRegionByName } from "../../../config";
import { useToast } from "react-native-paper-toast";

type Props = {
  navigation: fromModels.StandingsStackNavigationProp;
};

const Standings = ({ navigation }: Props) => {
  const ref = React.useRef<ScrollView>(null);
  const dispatch = useAppDispatch();
  const toaster = useToast();
  const activeLeague = useAppSelector(getActiveLeague)!;
  const seasons = useAppSelector(getLeagueSeasons);
  const regions = useAppSelector(getLeagueRegionsWithCode);
  const standings = useAppSelector(getLeagueStandings);
  const loading = useAppSelector(getStandingsLoading);
  const isFocused = useIsFocused();

  const [selectedRegion, setSelectedRegion] = useState<string>("");
  // const [regions, setRegions] = useState<{ code: string; title: string }[]>(
  //   FILTER_REGIONS,
  // );
  const [searchtext, setSearchtext] = useState([]);
  const [search, setSearch] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [rankMin, setRankMin] = useState<string>("");
  const [paginateRankMax, setPaginateRankMax] = useState<number | undefined>(
    undefined,
  );
  const [visible, setVisible] = React.useState(false);
  const [filterRegionRank, setFilterRegionRank] = useState<
    | {
        region: string;
        rankMin: string;
        season: string;
      }
    | undefined
  >(undefined);

  const indexSeasons: { [key: string]: string } = seasons.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.id]: cur.name,
    }),
    {},
  );

  const [drpSeasons, setDrpSeasons] = useState<
    { label: string; value: string }[]
  >(seasons.map(season => ({ label: season.name, value: season.id })));

  const setSeasons = () => {
    setDrpSeasons(
      seasons.map(season => ({ label: season.name, value: season.id })),
    );
  };

  const showDialog = () => {
    if (filterRegionRank) {
      setSelectedRegion(filterRegionRank.region);
      setRankMin(filterRegionRank.rankMin);
      setSelectedSeason(filterRegionRank.season);
    }
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  useEffect(() => {
    console.log(seasons, "seasons");

    const unsubscribe = navigation.addListener("blur", () => {
      dispatch(clearHeaderSubTitle());
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      dispatch(loadSeasonsByLeague(activeLeague.key));
      dispatch(loadRegionsByLeague(activeLeague.key));
    }

    return () => {
      mounted = false;
    };
  }, [activeLeague.key]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      if (mounted) {
        navigation.setOptions({
          headerTitle: `Worldwide`,
        });
        dispatch(setHeaderSubTitle("Ladder"));

        let request: fromModels.StandingRequest = {
          league: activeLeague.key,
        };

        if (filterRegionRank) {
          request = {
            ...request,
            region: filterRegionRank.region,
            rankMin: parseInt(filterRegionRank.rankMin, 10),
            season: filterRegionRank.season,
          };

          if (filterRegionRank.region) {
            const rg = regions.find(
              item => item.code === filterRegionRank.region,
            );
            navigation.setOptions({
              headerTitle: rg?.name,
            });
          } else if (filterRegionRank.season) {
            const rg = regions.find(
              item => item.code === filterRegionRank.season,
            );
            navigation.setOptions({
              headerTitle: rg?.name,
            });
          } else {
            navigation.setOptions({
              headerTitle: "Worldwide",
            });
          }
        }
        console.log(request, "request");

        dispatch(loadStandingsByLeague(request));
      }

      return () => {
        mounted = false;
      };
    }, [activeLeague.key, filterRegionRank]),
  );

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (paginateRankMax) {
        const request: fromModels.StandingRequest = {
          league: activeLeague.key,
          rankMin: paginateRankMax,
        };

        const resultAction = dispatch(loadStandingsByLeague(request));

        resultAction.then(() => {
          ref.current?.scrollTo({ x: 0, y: 0, animated: true });
        });
      }
    }
    return () => {
      mounted = false;
    };
  }, [paginateRankMax]);

  const goToTeamDetails = (team: fromModels.Team) => {
    navigation.navigate("TeamDetails", {
      teamId: team.id,
      teamName: team.name,
    });
  };

  const onRefresh = () => {
    setFilterRegionRank({
      region: "",
      rankMin: "",
      season: "",
    });
    setPaginateRankMax(undefined);
    setSelectedRegion("");
    setRankMin("");
  };

  const recruitMe = async (team: fromModels.Team) => {
    try {
      await dispatch(
        submitRecruitMe({
          teamId: team.id,
          recruitReq: {
            op: "replace",
            path: "/recruitRequest",
            value: true,
          },
        }),
      );
      dispatch(loadStandingsByLeague({ league: activeLeague.key }));
      toaster.show({
        message: "Recruit request has been sent successfully.",
        type: "success",
      });
    } catch (error) {
      toaster.show({
        message:
          "An error occurred while processing your request. Please try again.",
        type: "error",
      });
    }
  };

  const handleRegionFilterModal = () => {
    setFilterRegionRank({
      region: selectedRegion,
      rankMin: rankMin,
      season: selectedSeason,
    });
    hideDialog();
  };

  const paginate = () => {
    const maxRank = Math.max(...standings.map(item => item.rank));
    // const maxRankForSearch = Math.max(...searchtext.map(item => item.rank));
    setPaginateRankMax(maxRank + 1);
    // setPaginateRankMax(maxRankForSearch + 1);
  };

  const handleSearch = e => {
    setSearch(true);
    if (e) {
      setSearchtext(
        standings.filter(i => i.name.toLowerCase().includes(e.toLowerCase())),
      );
      console.log(searchtext, "after_search");
    } else {
      setSearch(false);
      // let request: fromModels.StandingRequest = {
      //   league: activeLeague.key,
      // };
      // if (filterRegionRank) {
      //   request = {
      //     ...request,
      //     region: filterRegionRank.region,
      //     rankMin: parseInt(filterRegionRank.rankMin, 10),
      //     season: filterRegionRank.season,
      //   };
      //   dispatch(loadStandingsByLeague(request));
      // }
    }
  };

  const renderRegionRegFilterModal = () => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Filter</Dialog.Title>
          <Divider />
          <Dialog.ScrollArea
            style={{
              paddingHorizontal: 0,
              maxHeight: 400,
            }}>
            <ScrollView>
              <List.Section>
                <List.Subheader>Season</List.Subheader>
                <RadioButton.Group
                  onValueChange={newValue => setSelectedSeason(newValue)}
                  value={selectedSeason}>
                  {seasons.map(season => (
                    <RadioButton.Item
                      label={season.name}
                      value={season.id}
                      key={`region-${season.id}`}
                      style={{
                        paddingVertical: 2,
                      }}
                    />
                  ))}
                </RadioButton.Group>
              </List.Section>
              <List.Section>
                <List.Subheader>Region</List.Subheader>
                <RadioButton.Group
                  onValueChange={newValue => setSelectedRegion(newValue)}
                  value={selectedRegion}>
                  {regions.map(region => (
                    <RadioButton.Item
                      label={region.name}
                      value={region.code}
                      key={`region-${region.code}`}
                      style={{
                        paddingVertical: 2,
                      }}
                    />
                  ))}
                </RadioButton.Group>
              </List.Section>
              <Divider />
              <List.Section>
                <List.Subheader>Min Rank</List.Subheader>
                <Block noflex marginHorizontal={15}>
                  <TextInput
                    placeholder="Minimum Rank"
                    returnKeyType="next"
                    value={rankMin}
                    onChangeText={text => setRankMin(text)}
                    autoCapitalize="none"
                    inputStyle={styles.textInput}
                    placeholderTextColor="#adadad"
                    containerStyle={styles.textInputContainer}
                    keyboardType="numeric"
                  />
                </Block>
              </List.Section>
            </ScrollView>
          </Dialog.ScrollArea>
          <Divider />
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleRegionFilterModal}>Filter</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  return (
    <React.Fragment>
      <SafeAreaView style={{ flex: 1 }}>
        <Block noflex>
          <TextInput
            placeholder="Search for a team in this region"
            returnKeyType="next"
            onChangeText={e => handleSearch(e)}
            autoCapitalize="none"
            placeholderTextColor="#adadad"
            inputStyle={styles.textInput}
            placeholderTextColor="#adadad"
            containerStyle={styles.textInputContainer}
          />
          <Icon name="search" color="#ffffff" size={25} style={styles.search} />
        </Block>
        <DataTable
          style={{
            marginBottom: 50,
          }}>
          <DataTable.Header style={{ paddingHorizontal: 0 }}>
            <DataTable.Title style={{ justifyContent: "center" }}>
              <Text subtitle primary>
                POS
              </Text>
            </DataTable.Title>
            <DataTable.Title style={{ justifyContent: "center" }}>
              <Text subtitle primary>
                DIV
              </Text>
            </DataTable.Title>
            <DataTable.Title style={{ justifyContent: "center", flex: 3 }}>
              <Text subtitle primary>
                TEAM
              </Text>
            </DataTable.Title>
            <DataTable.Title style={{ justifyContent: "center" }}>
              <Text subtitle primary>
                REG
              </Text>
            </DataTable.Title>
            <DataTable.Title style={{ justifyContent: "center" }}>
              <Text subtitle primary>
                W/L
              </Text>
            </DataTable.Title>
            <DataTable.Title style={{ justifyContent: "center" }}>
              <Text subtitle primary>
                PTS
              </Text>
            </DataTable.Title>
            <DataTable.Title style={{ justifyContent: "center" }}>
              <Text subtitle primary>
                MMR
              </Text>
            </DataTable.Title>
          </DataTable.Header>

          {standings.length > 0 ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              ref={ref}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={onRefresh}
                  tintColor={theme.colors.primary}
                  colors={[theme.colors.primary, theme.colors.text]}
                />
              }>
              {search
                ? searchtext.map(standing => (
                    <DataTable.Row
                      key={`standings-${standing.id}`}
                      style={{ paddingHorizontal: 0 }}>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}>
                        {standing.rank}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                          paddingVertical: 0,
                          marginVertical: 0,
                        }}>
                        <Block>
                          <Image
                            source={{
                              uri: resolveImage(standing.divisionLogo),
                            }}
                            style={{
                              width: 20,
                              height: 20,
                            }}
                          />
                        </Block>
                      </DataTable.Cell>

                      <Block row style={{ flex: 3 }} center>
                        <TouchableRipple
                          style={{ flex: 1, flexDirection: "row" }}
                          onPress={() => goToTeamDetails(standing)}>
                          <Block row center>
                            <Image
                              source={{ uri: resolveImage(standing.logo) }}
                              style={{
                                width: 20,
                                height: 20,
                                marginRight: 10,
                                marginLeft: 5,
                              }}
                            />
                            <Text
                              subtitle
                              size={13}
                              style={{ flex: 1, flexWrap: "wrap" }}>
                              {standing.name}
                            </Text>
                          </Block>
                        </TouchableRipple>
                        {standing.isRecruiting && (
                          <TouchableRipple
                            style={{ flex: 0, borderRadius: 50 }}
                            onPress={() => recruitMe(standing)}>
                            <Image
                              source={require("../../../assets/icons/teamIsRecruiting.png")}
                              style={{ width: 20, height: 20 }}
                            />
                          </TouchableRipple>
                        )}
                      </Block>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}>
                        {indexRegionByName[standing.region] ?? "-"}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}>
                        {standing.w}/{standing.l}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}>
                        {standing.pts}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}>
                        {standing.mmr}
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))
                : standings.map(standing => (
                    <DataTable.Row
                      key={`standings-${standing.id}`}
                      style={{ paddingHorizontal: 0 }}>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}>
                        {standing.rank}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                          paddingVertical: 0,
                          marginVertical: 0,
                        }}>
                        <Block>
                          <Image
                            source={{
                              uri: resolveImage(standing.divisionLogo),
                            }}
                            style={{
                              width: 20,
                              height: 20,
                            }}
                          />
                        </Block>
                      </DataTable.Cell>

                      <Block row style={{ flex: 3 }} center>
                        <TouchableRipple
                          style={{ flex: 1, flexDirection: "row" }}
                          onPress={() => goToTeamDetails(standing)}>
                          <Block row center>
                            <Image
                              source={{ uri: resolveImage(standing.logo) }}
                              style={{
                                width: 20,
                                height: 20,
                                marginRight: 10,
                                marginLeft: 5,
                              }}
                            />
                            <Text
                              subtitle
                              size={13}
                              style={{ flex: 1, flexWrap: "wrap" }}>
                              {standing.name}
                            </Text>
                          </Block>
                        </TouchableRipple>
                        {standing.isRecruiting && (
                          <TouchableRipple
                            style={{ flex: 0, borderRadius: 50 }}
                            onPress={() => recruitMe(standing)}>
                            <Image
                              source={require("../../../assets/icons/teamIsRecruiting.png")}
                              style={{ width: 20, height: 20 }}
                            />
                          </TouchableRipple>
                        )}
                      </Block>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}>
                        {indexRegionByName[standing.region] ?? "-"}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}>
                        {standing.w}/{standing.l}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}>
                        {standing.pts}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                        }}>
                        {standing.mmr}
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
              <Block noflex center>
                <IconButton
                  icon="arrow-down"
                  color="#fafafa"
                  onPress={paginate}
                  size={30}
                />
              </Block>
            </ScrollView>
          ) : (
            <Block noflex center marginVertical={20}>
              <Text white>No data is available.</Text>
            </Block>
          )}
        </DataTable>
        {renderRegionRegFilterModal()}
        {!visible && (
          <Portal>
            <FAB
              style={{
                position: "absolute",
                margin: 16,
                right: 0,
                bottom: 75,
              }}
              icon="filter"
              onPress={showDialog}
              visible={isFocused}
            />
            {/* <TouchableOpacity
            visible={isFocused}
            onPress={showDialog}
            style ={{marginTop:Platform.OS === "ios" ? "17%" : "5%",
                    right:20,
                    position:'absolute'
                  }}>
          <Text style ={{fontWeight:'700'}}>Filter</Text>
        </TouchableOpacity> */}
          </Portal>
        )}
      </SafeAreaView>
    </React.Fragment>
  );
};

export default Standings;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  textInput: {
    zIndex: 100,
    backgroundColor: coreTheme.colors.background,
    paddingLeft: 10,
  },
  textInputContainer: {
    marginVertical: 0,
    marginBottom: 10,
  },
  search: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
