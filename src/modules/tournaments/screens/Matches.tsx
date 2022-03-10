import { useFocusEffect, useIsFocused } from "@react-navigation/core";
import React, { useCallback, useState } from "react";

import { StyleSheet, ScrollView } from "react-native";
import { Tabs, TabScreen } from "react-native-paper-tabs";
import {
  Dialog,
  Divider,
  FAB,
  Portal,
  Button,
  List,
  RadioButton,
} from "react-native-paper";

import { Block, Text, TextInput } from "../../../components";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getActiveLeague } from "../../tournaments/store";
import ScheduledMatches from "../components/matches/ScheduledMatches";
import { TeamMatchHistory } from "../components/team-details";
import {
  getLeagueMatchesHistory,
  getLeagueUpcomingMatches,
  loadLeagueMatchesHistory,
  loadLeagueUpcomingMatches,
  submitVoteForCast,
  submitVoteForTeam,
  getLeagueSeasons,
} from "../store";
import * as fromModels from "../models";
import { theme as coreTheme } from "../../../core/theme";
import { FILTER_REGIONS } from "../../../config";

type Props = {
  navigation: fromModels.MatchesStackNavigationProp;
};

const Matches = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const upcomingMatches = useAppSelector(getLeagueUpcomingMatches);
  const pastMatches = useAppSelector(getLeagueMatchesHistory);
  const seasons = useAppSelector(getLeagueSeasons);
  const activeLeague = useAppSelector(getActiveLeague)!;
  const scheduledTitle =
    upcomingMatches.length > 0
      ? `Scheduled (${upcomingMatches.length})`
      : `Scheduled`;

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [regions, setRegions] = useState<{ code: string; title: string }[]>(
    FILTER_REGIONS,
  );
  const [posMin, setPosMin] = useState<string>("");
  const [visible, setVisible] = React.useState(false);
  const [filterRegionRank, setFilterRegionRank] = useState<
    | {
        region: string;
        posMin: string;
      }
    | undefined
  >(undefined);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      if (mounted) {
        let request: fromModels.MatchRequest = {
          league: activeLeague.key,
        };
        if (filterRegionRank) {
          request = {
            ...request,
            region: filterRegionRank.region,
            posMin: parseInt(filterRegionRank.posMin, 10),
          };

          if (filterRegionRank.region) {
            const rg = regions.find(
              item => item.code === filterRegionRank.region,
            );
            navigation.setOptions({
              headerTitle: rg?.title,
            });
          } else {
            navigation.setOptions({
              headerTitle: "Worldwide",
            });
          }
        } else {
          navigation.setOptions({
            headerTitle: "Worldwide",
          });
        }

        dispatch(loadLeagueUpcomingMatches(request));
        dispatch(loadLeagueMatchesHistory(request));
      }

      return () => {
        mounted = false;
      };
    }, [activeLeague.key, filterRegionRank]),
  );

  const handleVoteTeam = async (match: fromModels.Match) => {
    try {
      await dispatch(submitVoteForTeam(match.id));
      dispatch(loadLeagueUpcomingMatches({ league: activeLeague.key }));
    } catch (error) {
      console.log(error, "Matches => handleVoteTeam");
    }
  };
  const handleVoteCast = async (match: fromModels.Match) => {
    try {
      await dispatch(submitVoteForCast(match.id));
      dispatch(loadLeagueUpcomingMatches({ league: activeLeague.key }));
    } catch (error) {
      console.log(error, "Matches => handleVoteTeam");
    }
  };

  const showDialog = () => {
    if (filterRegionRank) {
      setSelectedRegion(filterRegionRank.region);
      // setRankMin(filterRegionRank.rankMin);
      setSelectedSeason(filterRegionRank.season);
    }
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
  };

  const handleRegionFilterModal = () => {
    setFilterRegionRank({
      region: selectedRegion,
      posMin: posMin,
      season: selectedSeason,
    });
    hideDialog();
  };

  const redirectToMatchDetails = (match: fromModels.BaseMatch) => {
    navigation.navigate("MatchDetails", {
      matchId: match.id,
    });
  };
  const redirectToTeamDetails = (match: fromModels.BaseTeam) => {
    // navigation.navigate("MatchDetails", {
    //   matchId: match.id,
    // });
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
                      label={region.title}
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
                    value={posMin}
                    onChangeText={text => setPosMin(text)}
                    inputStyle={styles.textInput}
                    placeholderTextColor="#adadad"
                    containerStyle={styles.textInputContainer}
                    // keyboardType="numeric"
                  />
                </Block>
                {/* )} */}
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
      <Tabs
        defaultIndex={tabIndex}
        onChangeIndex={newIndex => setTabIndex(newIndex)}>
        <TabScreen label={scheduledTitle}>
          <Block noflex margin={10}>
            <ScheduledMatches
              matches={upcomingMatches}
              voteTeam={handleVoteTeam}
              voteCast={handleVoteCast}
            />
          </Block>
        </TabScreen>
        <TabScreen label="Past">
          <Block noflex margin={10}>
            <TeamMatchHistory
              matches={pastMatches}
              goToMatchDetails={redirectToMatchDetails}
              goToTeamDetails={redirectToTeamDetails}
            />
          </Block>
        </TabScreen>
      </Tabs>
      {renderFilterModal()}
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
            visible={
              tabIndex === 0
                ? upcomingMatches.length > 0 && isFocused
                : pastMatches.length > 0 && isFocused
            }
          />
          {/* <TouchableOpacity
          visible={
              tabIndex === 0
                ? upcomingMatches.length > 0 && isFocused
                : pastMatches.length > 0 && isFocused
            }
          onPress={showDialog}
          style ={{ marginTop:Platform.OS === "ios" ? "17%" : "0%",
                    right:20,
                    position:'absolute'
                  }}>
        <Text style ={{fontWeight:'700'}}>Filter</Text>
        </TouchableOpacity> */}
        </Portal>
      )}
    </React.Fragment>
  );
};

export default Matches;

const styles = StyleSheet.create({
  textInput: {
    zIndex: 100,
    backgroundColor: coreTheme.colors.background,
    paddingLeft: 10,
  },
  textInputContainer: {
    marginVertical: 0,
    marginBottom: 10,
  },
});
