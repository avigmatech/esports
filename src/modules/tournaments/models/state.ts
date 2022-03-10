import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Caster,
  BaseStadium,
  Region,
  Season,
  Team,
  Match,
  Player,
  MatchHistory,
  TeamDetPlayers,
  League,
  TeamsStats,
  MatchTeamDetails,
  SubstitutePlayer,
} from "./games";

export interface CustomError {
  message: string;
}

export interface IPatchJson {
  op: string;
  path: string;
  value?: any;
}

export interface TournamentState {
  teamPlayers: TeamDetPlayers[];
  regions: Region[];
  seasons: Season[];
  casters: Caster[];
  substitutePlayers:SubstitutePlayer[];
  maps: BaseStadium[];
  standings: Team[];
  standingsLoading: boolean;
  error: string | undefined;
  filterRegRank: FilterRegionMinRank | undefined;
  teamDetails: Team | undefined;
  teamDetPlayers: Player[];
  teamUpcomingMatches: Match[];
  teamMatchesHistory: MatchHistory[];
  upcomingMatches: Match[];
  pastMatches: MatchHistory[];
  playerDetails: Player | undefined;
  playerScreenLoading: boolean;
  activeLeague: League | undefined;
  leagues: League[];
  teamStats: TeamsStats | undefined;
  teamStatsLoading: boolean;
  matchTeamDetails: MatchTeamDetails | undefined;
  matchTeamDetailsLoading: boolean;
}

export interface FilterRegionMinRank {
  region: string | null;
  rankMin: number | null;
}

export type PlayerStackParamList = {
  Players: undefined;
  PlayerDetails: {
    playerId: string;
    playerName: string;
  };
};

export type StandingsStackParamList = {
  Standings: {
    recruitingTeams?: boolean;
  };
  TeamDetails: {
    teamId: string;
    teamName: string;
  };
  PlayerDetails: {
    playerId: string;
    playerName: string;
  };
};

export type HomeStackParamList = {
  Home: undefined;
};

export type SelectLeagueParamList = {
  SelectLeague: {
    afterLogin: boolean;
  };
};

export type MatchesStackParamList = {
  Matches: undefined;
  MatchDetails: {
    matchId: string;
  };
};

export type TeamDetailsRouteProp = RouteProp<
  StandingsStackParamList,
  "TeamDetails"
>;

export type StandingsStackNavigationProp = StackNavigationProp<
  StandingsStackParamList,
  "TeamDetails"
>;

export type PlayersStackNavigatorProp = StackNavigationProp<
  PlayerStackParamList,
  "PlayerDetails"
>;

export type PlayerDetailsRouteProp = RouteProp<
  PlayerStackParamList,
  "PlayerDetails"
>;

export type SelectLeagueRouteProp = RouteProp<
  SelectLeagueParamList,
  "SelectLeague"
>;

export type MatchesRouteProp = RouteProp<MatchesStackParamList, "MatchDetails">;

export type MatchesStackNavigationProp = StackNavigationProp<MatchesStackParamList>;
export type HomeStackNavigationProp = StackNavigationProp<HomeStackParamList>;
export type SelectLeagueStackNavigationProp = StackNavigationProp<SelectLeagueParamList>;
