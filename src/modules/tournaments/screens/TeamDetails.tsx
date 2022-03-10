import { useFocusEffect } from "@react-navigation/core";
import React, { useCallback } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useTheme, DataTable } from "react-native-paper";
import { Block, Text } from "../../../components";
import { useAppDispatch, useAppSelector } from "../../../store";
import * as fromModels from "../models";
import {
  getTeamDetails,
  getTeamMatchesHistory,
  getTeamPlayers,
  getTeamUpcomingMatches,
  loadTeamDetails,
  loadTeamMatchesHistory,
  loadTeamPlayers,
  loadTeamUpcomingMatches,
} from "../store";
import {
  BasicDetails,
  Players,
  TeamUpcomingMatches,
  TeamMatchHistory,
} from "../components/team-details";

type Props = {
  navigation: fromModels.StandingsStackNavigationProp;
  route: fromModels.TeamDetailsRouteProp;
};

type TeamStatsProps = {
  details: fromModels.Team;
};

const TeamStats = ({ details }: TeamStatsProps) => {
  return (
    <Block>
      <Block noflex center marginBottom={10}>
        <Text title primary>
          Stats of Current Season
        </Text>
      </Block>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={styles.title}>GP</DataTable.Title>
          <DataTable.Title style={styles.title}>WIN</DataTable.Title>
          <DataTable.Title style={styles.title}>LOSS</DataTable.Title>
          <DataTable.Title style={styles.title}>PTS</DataTable.Title>
          <DataTable.Title style={styles.title}>WIN %</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell style={styles.cell}>{details.gp}</DataTable.Cell>
          <DataTable.Cell style={styles.cell}>{details.w}</DataTable.Cell>
          <DataTable.Cell style={styles.cell}>{details.l}</DataTable.Cell>
          <DataTable.Cell style={styles.cell}>{details.pts}</DataTable.Cell>
          <DataTable.Cell style={styles.cell}>
            {(details.w / details.gp) * 100}
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </Block>
  );
};

const TeamDetails = ({ navigation, route }: Props) => {
  const {
    params: { teamName, teamId },
  } = route;
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const teamDetails = useAppSelector(getTeamDetails);
  const players = useAppSelector(getTeamPlayers);
  const upcomingMatches = useAppSelector(getTeamUpcomingMatches);
  const matchesHistories = useAppSelector(getTeamMatchesHistory);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      if (mounted) {
        navigation.setOptions({
          headerTitle: teamName,
        });
        dispatch(loadTeamDetails(teamId));
        dispatch(loadTeamPlayers(teamId));
        dispatch(loadTeamUpcomingMatches(teamId));
        dispatch(loadTeamMatchesHistory(teamId));
      }

      return () => {
        mounted = false;
      };
    }, [teamId, teamName]),
  );

  const redirectToPlayerDetails = (player: fromModels.Player) => {
    navigation.navigate("PlayerDetails", {
      playerId: player.id,
      playerName: player.name,
    });
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Block>
          {teamDetails && <BasicDetails details={teamDetails} />}
          {teamDetails && <TeamStats details={teamDetails} />}
          <Players
            players={players}
            handlePlayerRedirect={redirectToPlayerDetails}
          />
          <TeamUpcomingMatches matches={upcomingMatches} />
          <Block noflex margin={10}>
            <Block noflex center marginBottom={10}>
              <Text title primary>
                Past Matches
              </Text>
            </Block>
            <TeamMatchHistory
              matches={matchesHistories}
              goToMatchDetails={redirectToMatchDetails}
              goToTeamDetails={redirectToTeamDetails}
            />
          </Block>
        </Block>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeamDetails;

const styles = StyleSheet.create({
  cell: {
    justifyContent: "center",
  },
  title: {
    justifyContent: "center",
  },
});
