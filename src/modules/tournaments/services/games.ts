import { api, apisubstitute } from "../../../utils";
import * as fromModels from "../models";

// Function Calls
export const getPlayersByLeague = async (
  league: string,
  region?: string,
): Promise<fromModels.TeamDetPlayers[]> => {
  return await api().get(`/${league}/Players?region=${region}`);
};

export const getSubstitutesByLeague = async (
  game: string,
): Promise<fromModels.SubstitutePlayer[]> => {
  return await apisubstitute().get(`/${game}/Substitutes`);
  console.log(game,"game");
};

export const getConnoissuersByLeague = async (
  league: string,
  region?: string,
) => {
  return await api().get(`/${league}/Players?region=${region}`);
};

export const getCastersByLeague = async (
  league: string,
): Promise<fromModels.Caster[]> => {
  return await api().get(`/${league}/Casters`);
};

export const getRegionsByLeague = async (
  league: string,
): Promise<fromModels.Region[]> => {
  return await api().get(`/${league}/Regions`);
};

export const getSeasonsByLeague = async (
  league: string,
): Promise<fromModels.Season[]> => {
  return await api().get(`/${league}/Seasons`);
};

export const getStandingsByLeague = async (
  data: fromModels.StandingRequest,
): Promise<fromModels.Team[]> => {
  return await api().get(
    `/${data.league}/Standings?region=${data.region}&rankMin=${data.rankMin}&season=${data.season}`,
  );
};

export const getSearchStandingsByLeague = async (
  data: fromModels.StandingRequestSearch,
): Promise<fromModels.Team[]> => {
  return await api().get(
    `/${data.league}/Teams/Search?name=${data.name}&region=${data.region}&rankMin=${data.rankMin}&season=${data.season}`,
  );
};

export const getTeamDetails = async (
  teamId: string,
): Promise<fromModels.Team> => {
  return await api().get(`/Teams/${teamId}`);
};

export const getTeamPlayers = async (
  teamId: string,
): Promise<fromModels.TeamDetPlayers> => {
  return await api().get(`/Teams/${teamId}/Players`);
};

export const getTeamUpcomingMatches = async (
  teamId: string,
): Promise<fromModels.Match[]> => {
  return await api().get(`/Teams/${teamId}/Matches/Upcoming`);
};

export const getTeamMatchesHistory = async (
  teamId: string,
): Promise<fromModels.MatchHistory[]> => {
  return await api().get(`/Teams/${teamId}/Matches/History`);
};

export const getLeagueUpcomingMatches = async (
  request: fromModels.MatchRequest,
): Promise<fromModels.Match[]> =>
  await api().get(
    `/${request.league}/Matches/Upcoming?region?=${request.region}`,
  );

export const getLeagueUpcomingMatchDetails = async (
  league: string,
  matchId: string,
): Promise<fromModels.Match[]> =>
  await api().get(`/${league}/Matches/Upcoming/${matchId}`);

export const getLeagueUpcomingProdMatchDetails = async (
  league: string,
  matchId: string,
): Promise<fromModels.Match[]> =>
  await api().get(`/${league}/Matches/UpcomingProduction/${matchId}`);

export const getLeagueMatchesHistory = async (
  request: fromModels.MatchRequest,
): Promise<fromModels.MatchHistory[]> =>
  await api().get(
    `/${request.league}/Matches/History?region=${request.region}&posMin=${request.posMin}`,
  );

export const getLeagueMatchHistoryDetails = async (
  league: string,
  matchId: string,
): Promise<fromModels.MatchHistory[]> =>
  await api().get(`/${league}/Matches/History/${matchId}`);

export const voteForTeam = async (matchId: string) =>
  await api().get(`/Matches/${matchId}/voteTeam`);

export const voteForCast = async (matchId: string) =>
  await api().get(`/Matches/${matchId}/voteCast`);

export const getPlayerDetails = async (
  playerId: string,
): Promise<fromModels.Player> => await api().get(`/Players/${playerId}`);

export const createTeam = async (request: fromModels.CreateTeam) => {
  return api().put(`/Teams`, request);
};

export const registerAsSubstitute = async (
  request: fromModels.RegisterAsSubstitute,
) => {
  return api().put(`/${request.game}/Substitutes/${request.region}`, request);
};

export const unregisterAsSubstitute = async (game: string) => {
  return api().delete(`/${game}/Substitutes`);
};

export const statsBetweenTeams = async (
  homeTeamId: string,
  awayTeamId: string,
): Promise<fromModels.TeamsStats> =>
  await api().get(`/Teams/${awayTeamId}/${awayTeamId}`);

export const sendRecruitMe = async (request: fromModels.RecruitTeamRequest) =>
  await api().patch(`/Teams/${request.teamId}`, request.recruitReq);
