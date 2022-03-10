import React, { useCallback, useState } from "react";
import { useTheme, ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { Block, EmptyBlockMessage, Text } from "../../../components";
import { useAppDispatch, useAppSelector } from "../../../store";
import * as fromModels from "../models";
import {
  getMatchFromPastById,
  getMatchStatistics,
  loadTeamsStats,
  loadMatchTeamDetails,
  getMatchTeamDetails,
  getMatchTeamDetailsLoading,
  getMatchStatsLoading,
} from "../store";
import { SafeAreaView, ScrollView } from "react-native";
import {
  CompareTeams,
  CommonMatches,
  CommonMaps,
  TeamHistory,
} from "../components/match-details";

type LoaderProps = {
  message?: string;
  loaderSize?: number;
};

const Loader = ({ message, loaderSize = 30 }: LoaderProps) => {
  const theme = useTheme();
  return (
    <Block marginVertical={20} center middle>
      <ActivityIndicator color={theme.colors.primary} size={loaderSize} />
      {message && <Text subtitle>{message}</Text>}
    </Block>
  );
};

type Props = {
  navigation: fromModels.MatchesStackNavigationProp;
  route: fromModels.MatchesRouteProp;
};

const MatchDetails = ({ navigation, route }: Props) => {
  const {
    params: { matchId },
  } = route;
  const dispatch = useAppDispatch();
  const matchDetails = useAppSelector(state =>
    getMatchFromPastById(state, matchId),
  )!;
  const matchStats = useAppSelector(getMatchStatistics);
  const matchTeamDetails = useAppSelector(getMatchTeamDetails);
  const matchTeamDetailsLoading = useAppSelector(getMatchTeamDetailsLoading);
  const teamStatsLoading = useAppSelector(getMatchStatsLoading);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      if (mounted) {
        navigation.setOptions({
          headerTitle: "Match Details",
        });
        console.log(matchStats, "matchStats");
        dispatch(
          loadTeamsStats({
            homeTeamId: matchDetails.homeTeam.id,
            awayTeamId: matchDetails.awayTeam.id,
          }),
        );
        dispatch(
          loadMatchTeamDetails({
            homeTeamId: matchDetails.homeTeam.id,
            awayTeamId: matchDetails.awayTeam.id,
          }),
        );
      }

      return () => {
        mounted = false;
      };
    }, [matchDetails]),
  );

  return (
    <SafeAreaView style={{ flex: 1, margin: 10 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}>
        {matchTeamDetailsLoading ? (
          <Loader message="Loading team details..." />
        ) : (
          matchTeamDetails &&
          matchStats && (
            <CompareTeams
              homeTeam={matchTeamDetails.homeTeam}
              awayTeam={matchTeamDetails.awayTeam}
              matchStats={matchStats}
            />
          )
        )}

        {teamStatsLoading ? (
          <Loader message="Loading match details..." />
        ) : matchStats ? (
          <React.Fragment>
            <CommonMatches matches={matchStats?.commonMatches} />

            <CommonMaps
              maps={matchStats?.commonMaps}
              homeTeam={matchDetails.homeTeam}
              awayTeam={matchDetails.awayTeam}
            />
            <TeamHistory
              histories={matchStats.team1History}
              team={matchDetails.homeTeam}
            />
            <TeamHistory
              histories={matchStats?.team2History}
              team={matchDetails.awayTeam}
            />
          </React.Fragment>
        ) : (
          <EmptyBlockMessage message="Unable to fetch match details" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MatchDetails;
