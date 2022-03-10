import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Tabs, TabScreen } from "react-native-paper-tabs";
import { useFocusEffect, useIsFocused } from "@react-navigation/core";
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
import { Block, Text, TextInput } from "../../../components";
import {
  Players,
  Connoissueurs,
  Substitutes,
  Casters,
} from "./../components/players";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getActiveLeague } from "../../tournaments/store";

import {
  getCasters,
  getPlayers,
  getSubstitute,
  getPlayerScreenLoading,
  loadCastersByLeague,
  loadPlayersByLeague,
  getLeagueSeasons,
  loadSubstituteByLeague,
  getLeagueRegionsWithCode,
} from "../store";
import * as fromModels from "../models";
import { theme as coreTheme, theme } from "../../../core/theme";
import { FILTER_REGIONS } from "../../../config";

type Props = {
  navigation: fromModels.PlayersStackNavigatorProp;
};

const PlayersScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const activeLeague = useAppSelector(getActiveLeague)!;
  const seasons = useAppSelector(getLeagueSeasons);
  // const regions = useAppSelector(getLeagueRegionsWithCode);
  // const activeLeague: fromModels.League = useAppSelector(getActiveLeague)!;
  const teams = useAppSelector(getPlayers);

  const casters = useAppSelector(getCasters);

  const [tabIndex, setTabIndex] = useState<number>(0);
  const loading = useAppSelector(getPlayerScreenLoading);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const isFocused = useIsFocused();
  const [regions, setRegions] = useState<{ code: string; title: string }[]>(
    FILTER_REGIONS,
  );
  const [paginateRankMax, setPaginateRankMax] = useState<number | undefined>(
    undefined,
  );
  const [posMin, setPosMin] = useState<string>("");
  const [rankMin, setRankMin] = useState<string>("");
  const [visible, setVisible] = React.useState(false);
  const [searchtext, setSearchtext] = useState([]);
  const [substitute, setSubstitue] = useState([]);
  const [filterRegionRank, setFilterRegionRank] = useState<
    | {
        region: string;
        rankMin: string;
        season: string;
      }
    | undefined
  >(undefined);

  const showDialog = () => {
    if (filterRegionRank) {
      setSelectedRegion(filterRegionRank.region);
      setRankMin(filterRegionRank.rankMin);
      setSelectedSeason(filterRegionRank.season);
    }
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      if (mounted) {
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
          } else {
            navigation.setOptions({
              headerTitle: "Worldwide",
            });
          }
        }
        if (teams.length === 0) {
          dispatch(loadPlayersByLeague(activeLeague.key));
        }
        // if (subst.length === 0) {
        //   dispatch(loadSubstituteByLeague(activeLeague.key));
        // }
      }
      // if (casters.length === 0) {
      //   dispatch(loadCastersByLeague(activeLeague.key));
      // }

      return () => {
        mounted = false;
      };
    }, [activeLeague, filterRegionRank]),
  );

  useEffect(() => {
    SubstituteData();
  }, []);

  const SubstituteData = async () => {
    const data = "";
    const game = activeLeague.key;
    try {
      const response = await fetch(
        `https://api.vrmasterleague.com/${game}/Substitutes`,
      );
      const json = await response.json();
      setSubstitue(json.active);
    } catch (error) {
      console.error(error);
    }
  };

  const redirectToPlayerDetails = (player: fromModels.Player) => {
    navigation.navigate("PlayerDetails", {
      playerId: player.id,
      playerName: player.name,
    });
  };

  const redirectToSubstituteDetails = substitute => {
    navigation.navigate("SubstituteDetails", {
      substitute: substitute,
      substituteId: substitute.playerID,
      substituteName: substitute.userName,
    });
  };

  const handleRefreshTeamsData = () => {
    dispatch(loadPlayersByLeague(activeLeague.key));
    // dispatch(loadSubstituteByLeague(activeLeague.key));
  };

  const handleRefreshCastersData = () => {
    dispatch(loadCastersByLeague(activeLeague.key));
  };

  const handleRegionFilterModal = () => {
    setFilterRegionRank({
      region: selectedRegion,
      rankMin: rankMin,
    });
    hideDialog();
  };

  const renderFilterModal = () => {
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
              {/* <List.Section>
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
              </List.Section> */}
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
                    />
                  ))}
                </RadioButton.Group>
              </List.Section>
              <Divider />
              <List.Section>
                <List.Subheader>Min Rank</List.Subheader>
                {/* {tabIndex === 1 && ( */}
                <Block noflex paddingHorizontal={20}>
                  <TextInput
                    placeholder="Minimum Rank"
                    value={rankMin}
                    onChangeText={text => setRankMin(text)}
                    inputStyle={styles.textInput}
                    placeholderTextColor="#adadad"
                    containerStyle={styles.textInputContainer}
                    keyboardType="numeric"
                  />
                </Block>
                {/* )} */}
              </List.Section>
            </ScrollView>
          </Dialog.ScrollArea>
          <Divider />
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleRegionFilterModal}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  return (
    <React.Fragment>
      <Tabs>
        <TabScreen label={"Players"}>
          <Players
            teams={teams}
            handlePlayerDetails={redirectToPlayerDetails}
            refreshData={handleRefreshTeamsData}
            // handleSearch={handleSearch}
            loading={loading}
          />
        </TabScreen>
        <TabScreen label={"Substitutes"}>
          <Substitutes
            substitute={substitute}
            handleSubstituteDetails={redirectToSubstituteDetails}
          />
        </TabScreen>
        {/* 
      <TabScreen label={"Connoissueurs"}>
        <Connoissueurs />
      </TabScreen> */}
        {/* <TabScreen label={"Casters"}>
        <Block margin={10}>
          <Casters casters={casters} refreshData={handleRefreshCastersData} />
        </Block>
      </TabScreen> */}
        {/* <TabScreen label={"Cooldown"}>
        <Connoissueurs />
      </TabScreen> */}
      </Tabs>

      {/* {renderFilterModal()}
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
          visible={isFocused}
          onPress={showDialog}
          visible={isFocused}
        />
      </Portal> 
    )} */}
    </React.Fragment>
  );
};

export default PlayersScreen;

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
    borderBottomColor: "transparent",
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
