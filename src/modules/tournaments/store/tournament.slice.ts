import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import * as fromServices from "../services";
import * as fromModels from "../models";
import { RootState } from "../../../store";
import { setSnackbarMessage } from "../../common/store";
import { leagues } from "../constants";
import { getTeams } from "../../settings/store";
import { getCurrentUser } from "../../auth/store";
import { indexRegionByName } from "../../../config";

const initialState: fromModels.TournamentState = {
  teamPlayers: [],
  substitutePlayers:[],
  regions: [],
  seasons: [],
  casters: [],
  maps: [],
  standings: [],
  standingsLoading: false,
  standingsSearchLoading:false,
  error: undefined,
  filterRegRank: undefined,
  teamDetails: undefined,
  teamDetPlayers: [],
  teamUpcomingMatches: [],
  teamMatchesHistory: [],
  upcomingMatches: [],
  pastMatches: [],
  playerDetails: undefined,
  playerScreenLoading: false,
  activeLeague: undefined,
  leagues: leagues,
  teamStats: undefined,
  matchTeamDetails: undefined,
  teamStatsLoading: false,
  matchTeamDetailsLoading: false,
};

// Constants
export const LOAD_REGIONS_BY_LEAGUE = "tournament/LOAD_REGIONS_BY_GAME";
export const LOAD_SEASONS_BY_LEAGUE = "tournament/LOAD_SEASONS_BY_LEAGUE";
export const LOAD_CASTERS_BY_LEAGUE = "tournament/LOAD_CASTERS_BY_LEAGUE";
export const LOAD_SUBSTITUTE_BY_LEAGUE = "tournament/LOAD_SUBSTITUTE_BY_LEAGUE";
export const LOAD_STANDINGS_BY_LEAGUE = "tournament/LOAD_STANDINGS_BY_LEAGUE";
export const LOAD_SEARCH_STANDINGS_BY_LEAGUE = "tournament/LOAD_SEARCH_STANDINGS_BY_LEAGUE";
export const LOAD_PLAYERS_BY_LEAGUE = "tournament/LOAD_PLAYERS_BY_LEAGUE";
export const LOAD_TEAM_DETAILS = "tournament/LOAD_TEAM_DETAILS";
export const LOAD_TEAM_PLAYERS = "tournament/LOAD_TEAM_PLAYERS";
export const LOAD_TEAM_UPCOMING_MATCHES =
  "tournament/LOAD_TEAM_UPCOMING_MATCHES";
export const LOAD_TEAM_MATCHES_HISTORY = "tournament/LOAD_TEAM_MATCHES_HISTORY";
export const LOAD_UPCOMING_MATCHES = "tournament/LOAD_UPCOMING_MATCHES";
export const LOAD_MATCHES_HISTORY = "tournament/LOAD_MATCHES_HISTORY";
export const SUBMIT_VOTE_FOR_TEAM = "tournament/SUBMIT_VOTE_FOR_TEAM";
export const SUBMIT_VOTE_FOR_CAST = "tournament/SUBMIT_VOTE_FOR_CAST";
export const LOAD_PLAYER_DETAILS = "tournament/LOAD_PLAYER_DETAILS";
export const CREATE_A_TEAM = "tournament/CREATE_A_TEAM";
export const REGISTER_AS_SUBSTITUTE = "tournament/REGISTER_AS_SUBSTITUTE";
export const UNREGISTER_AS_SUBSTITUTE = "tournament/UNREGISTER_AS_SUBSTITUTE";
export const LOAD_STATS_BETWEEN_TEAMS = "tournament/LOAD_STATS_BETWEEN_TEAMS";
export const LOAD_MATCH_TEAM_DETAILS = "tournament/LOAD_MATCH_TEAM_DETAILS";
export const SEND_RECRUIT_ME = "tournament/SEND_RECRUIT_ME";

// Action Thunks
//#region Action Thunks
export const loadRegionsByLeague = createAsyncThunk<
  fromModels.Region[],
  string,
  { rejectValue: fromModels.CustomError }
>(LOAD_REGIONS_BY_LEAGUE, async (league: string, { rejectWithValue }) => {
  try {
    return await fromServices.getRegionsByLeague(league);
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const loadSeasonsByLeague = createAsyncThunk<
  fromModels.Season[],
  string,
  { rejectValue: fromModels.CustomError }
>(LOAD_SEASONS_BY_LEAGUE, async (league: string, { rejectWithValue }) => {
  try {
    return await fromServices.getSeasonsByLeague(league);
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export const loadCastersByLeague = createAsyncThunk<
  fromModels.Caster[],
  string,
  { rejectValue: fromModels.CustomError }
>(LOAD_CASTERS_BY_LEAGUE, async (league: string, { rejectWithValue }) => {
  try {
    return await fromServices.getCastersByLeague(league);
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const loadPlayersByLeague = createAsyncThunk<
  fromModels.TeamDetPlayers[],
  string,
  { rejectValue: fromModels.CustomError }
>(
  LOAD_PLAYERS_BY_LEAGUE,
  async (league: string, { rejectWithValue, dispatch }) => {
    dispatch(setPlayerScreenLoading());
    try {
      return await fromServices.getPlayersByLeague(league);
    } catch (error) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(resetPlayerScreenLoading());
    }
  },
);

export const loadSubstituteByLeague = createAsyncThunk<
  fromModels.SubstitutePlayer[],
  string,
  { rejectValue: fromModels.CustomError }
>(
  LOAD_SUBSTITUTE_BY_LEAGUE, 
  async (game: string, { rejectWithValue }) => {
  try {
    return await fromServices.getSubstitutesByLeague(game);
  } catch (error) {
    return rejectWithValue(error.response.data);
  } 
});

export const loadStandingsByLeague = createAsyncThunk<
  fromModels.Team[],
  fromModels.StandingRequest,
  { rejectValue: fromModels.CustomError }
>(
  LOAD_STANDINGS_BY_LEAGUE,
  async (data: fromModels.StandingRequest, thunkApi) => {
    thunkApi.dispatch(setStandingsLoading());
    try {
      return await fromServices.getStandingsByLeague(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    } finally {
      thunkApi.dispatch(resetStandingsLoading());
    }
  },
);

export const loadSearchStandingsByLeague = createAsyncThunk<
  fromModels.Team[],
  fromModels.StandingRequestSearch,
  { rejectValue: fromModels.CustomError }
>(
  LOAD_SEARCH_STANDINGS_BY_LEAGUE,
  async (data: fromModels.StandingRequestSearch, thunkApi) => {
    thunkApi.dispatch(setStandingsSearchLoading());
    try {
      return await fromServices.getSearchStandingsByLeague(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    } finally {
      thunkApi.dispatch(resetStandingsSearchLoading());
    }
  },
);

export const loadTeamDetails = createAsyncThunk<
  fromModels.Team,
  string,
  { rejectValue: fromModels.CustomError }
>(LOAD_TEAM_DETAILS, async (teamId: string, thunkApi) => {
  try {
    return await fromServices.getTeamDetails(teamId);
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const loadTeamPlayers = createAsyncThunk<
  fromModels.Player[],
  string,
  { rejectValue: fromModels.CustomError }
>(LOAD_TEAM_PLAYERS, async (teamId: string, thunkApi) => {
  try {
    const teamDetPlayers = await fromServices.getTeamPlayers(teamId);
    return teamDetPlayers.players ?? [];
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const loadTeamUpcomingMatches = createAsyncThunk<
  fromModels.Match[],
  string,
  { rejectValue: fromModels.CustomError }
>(LOAD_TEAM_UPCOMING_MATCHES, async (teamId: string, thunkApi) => {
  try {
    return await fromServices.getTeamUpcomingMatches(teamId);
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const loadTeamMatchesHistory = createAsyncThunk<
  fromModels.MatchHistory[],
  string,
  { rejectValue: fromModels.CustomError }
>(LOAD_TEAM_MATCHES_HISTORY, async (teamId: string, thunkApi) => {
  try {
    return await fromServices.getTeamMatchesHistory(teamId);
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const loadLeagueUpcomingMatches = createAsyncThunk<
  fromModels.Match[],
  fromModels.MatchRequest,
  { rejectValue: fromModels.CustomError }
>(LOAD_UPCOMING_MATCHES, async (request: fromModels.MatchRequest, thunkApi) => {
  try {
    return await fromServices.getLeagueUpcomingMatches(request);
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const loadLeagueMatchesHistory = createAsyncThunk<
  fromModels.MatchHistory[],
  fromModels.MatchRequest,
  { rejectValue: fromModels.CustomError }
>(LOAD_MATCHES_HISTORY, async (request: fromModels.MatchRequest, thunkApi) => {
  try {
    return await fromServices.getLeagueMatchesHistory(request);
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const submitVoteForTeam = createAsyncThunk<
  void,
  string,
  { rejectValue: fromModels.CustomError }
>(SUBMIT_VOTE_FOR_TEAM, async (matchId: string, thunkApi) => {
  try {
    await fromServices.voteForTeam(matchId);
  } catch (error) {
    thunkApi.dispatch(
      setSnackbarMessage("An error occurred while processing your request"),
    );
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const submitVoteForCast = createAsyncThunk<
  void,
  string,
  { rejectValue: fromModels.CustomError }
>(SUBMIT_VOTE_FOR_CAST, async (matchId: string, thunkApi) => {
  try {
    await fromServices.voteForCast(matchId);
  } catch (error) {
    thunkApi.dispatch(
      setSnackbarMessage("An error occurred while processing your request"),
    );
    return thunkApi.rejectWithValue(error.response.data);
  }
});
export const loadPlayerDetails = createAsyncThunk<
  fromModels.Player,
  string,
  { rejectValue: fromModels.CustomError }
>(LOAD_PLAYER_DETAILS, async (playerId: string, thunkApi) => {
  try {
    return await fromServices.getPlayerDetails(playerId);
  } catch (error) {
    thunkApi.dispatch(
      setSnackbarMessage("An error occurred while processing your request"),
    );
    return thunkApi.rejectWithValue(error.response.data);
  }
});
export const createATeam = createAsyncThunk<
  void,
  fromModels.CreateTeam,
  { rejectValue: fromModels.CustomError }
>(CREATE_A_TEAM, async (request: fromModels.CreateTeam, thunkApi) => {
  try {
    await fromServices.createTeam(request);
  } catch (error) {
    thunkApi.dispatch(
      setSnackbarMessage("An error occurred while processing your request"),
    );
    return thunkApi.rejectWithValue(error.response.data);
  }
});
export const registerAsSubstitute = createAsyncThunk<
  void,
  fromModels.RegisterAsSubstitute,
  { rejectValue: fromModels.CustomError }
>(
  REGISTER_AS_SUBSTITUTE,
  async (request: fromModels.RegisterAsSubstitute, thunkApi) => {
    try {
      await fromServices.registerAsSubstitute(request);
    } catch (error) {
      thunkApi.dispatch(
        setSnackbarMessage("An error occurred while processing your request"),
      );
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);
export const unRegisterAsSubstitute = createAsyncThunk<
  void,
  string,
  { rejectValue: fromModels.CustomError }
>(UNREGISTER_AS_SUBSTITUTE, async (game: string, thunkApi) => {
  try {
    await fromServices.unregisterAsSubstitute(game);
  } catch (error) {
    thunkApi.dispatch(
      setSnackbarMessage("An error occurred while processing your request"),
    );
    return thunkApi.rejectWithValue(error.response.data);
  }
});
export const loadTeamsStats = createAsyncThunk<
  fromModels.TeamsStats,
  fromModels.MatchStats,
  { rejectValue: fromModels.CustomError }
>(
  LOAD_STATS_BETWEEN_TEAMS,
  async (statsReq: fromModels.MatchStats, thunkApi) => {
    try {
      return await fromServices.statsBetweenTeams(
        statsReq.homeTeamId,
        statsReq.awayTeamId,
      );
    } catch (error) {
      thunkApi.dispatch(
        setSnackbarMessage("An error occurred while processing your request"),
      );
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);
export const loadMatchTeamDetails = createAsyncThunk<
  fromModels.MatchTeamDetails,
  fromModels.MatchTeamDetailsRequest,
  { rejectValue: fromModels.CustomError }
>(
  LOAD_MATCH_TEAM_DETAILS,
  async (request: fromModels.MatchTeamDetailsRequest, thunkApi) => {
    thunkApi.dispatch(setMatchTeamDetailsLoading());
    try {
      const homeTeam = await fromServices.getTeamPlayers(request.homeTeamId);
      const awayTeam = await fromServices.getTeamPlayers(request.awayTeamId);
      thunkApi.dispatch(resetMatchTeamDetailsLoading());
      return {
        homeTeam,
        awayTeam,
      };
    } catch (error) {
      thunkApi.dispatch(resetMatchTeamDetailsLoading());
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);
export const submitRecruitMe = createAsyncThunk<
  void,
  fromModels.RecruitTeamRequest,
  { rejectValue: fromModels.CustomError }
>(SEND_RECRUIT_ME, async (request: fromModels.RecruitTeamRequest, thunkApi) => {
  try {
    await fromServices.sendRecruitMe(request);
  } catch (error) {
    thunkApi.dispatch(
      setSnackbarMessage("An error occurred while processing your request"),
    );
    return thunkApi.rejectWithValue(error.response.data);
  }
});
//#endregion

export const tournamentSlice = createSlice({
  name: "tournament",
  initialState: initialState,
  reducers: {
    setActiveLeague: (state, action: PayloadAction<fromModels.League>) => {
      state.activeLeague = action.payload;
    },
    resetActiveLeague: state => {
      state.activeLeague = undefined;
    },
    setError: (state, action: PayloadAction<fromModels.CustomError>) => {
      state.error = action.payload.message;
    },
    clearError: state => {
      state.error = undefined;
    },
    setFilterRegRank: (
      state,
      action: PayloadAction<fromModels.FilterRegionMinRank>,
    ) => {
      state.filterRegRank = action.payload;
    },
    resetFilterRegRank: state => {
      state.filterRegRank = undefined;
    },
    setStandingsLoading: state => {
      state.standingsLoading = true;
    },
    setStandingsSearchLoading: state => {
      state.standingsSearchLoading =true
    },
    resetStandingsLoading: state => {
      state.standingsLoading = false;
    },
     resetStandingsSearchLoading: state => {
      state.standingsSearchLoading = false;
    },
    setPlayerScreenLoading: state => {
      state.playerScreenLoading = true;
    },
    resetPlayerScreenLoading: state => {
      state.playerScreenLoading = false;
    },
    setTeamStatsLoading: state => {
      state.teamStatsLoading = true;
    },
    resetTeamStatsLoading: state => {
      state.teamStatsLoading = false;
    },
    setMatchTeamDetailsLoading: state => {
      state.matchTeamDetailsLoading = true;
    },
    resetMatchTeamDetailsLoading: state => {
      state.matchTeamDetailsLoading = false;
    },
  },
  extraReducers: (
    builder: ActionReducerMapBuilder<fromModels.TournamentState>,
  ) => {
    builder
      .addCase(
        loadRegionsByLeague.fulfilled,
        (state, action: PayloadAction<fromModels.Region[]>) => {
          state.regions = action.payload;
        },
      )
      .addCase(loadRegionsByLeague.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(
        loadSeasonsByLeague.fulfilled,
        (state, action: PayloadAction<fromModels.Season[]>) => {
          state.seasons = action.payload;
        },
      )
      .addCase(loadSeasonsByLeague.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(
        loadStandingsByLeague.fulfilled,
        (state, action: PayloadAction<fromModels.Team[]>) => {
          state.standings = action.payload;
        },
      )
      .addCase(loadStandingsByLeague.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(
        loadSearchStandingsByLeague.fulfilled,
        (state, action: PayloadAction<fromModels.Team[]>) => {
          state.standings = action.payload;
        },
      )
      .addCase(loadSearchStandingsByLeague.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadTeamDetails.fulfilled, (state, action) => {
        state.teamDetails = action.payload;
      })
      .addCase(loadTeamDetails.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadTeamPlayers.fulfilled, (state, action) => {
        state.teamDetPlayers = action.payload;
      })
      .addCase(loadTeamPlayers.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadTeamUpcomingMatches.fulfilled, (state, action) => {
        state.teamUpcomingMatches = action.payload;
      })
      .addCase(loadTeamUpcomingMatches.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadTeamMatchesHistory.fulfilled, (state, action) => {
        state.teamMatchesHistory = action.payload;
      })
      .addCase(loadTeamMatchesHistory.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadLeagueUpcomingMatches.fulfilled, (state, action) => {
        state.upcomingMatches = action.payload;
      })
      .addCase(loadLeagueUpcomingMatches.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadLeagueMatchesHistory.fulfilled, (state, action) => {
        state.pastMatches = action.payload;
      })
      .addCase(loadLeagueMatchesHistory.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(submitVoteForTeam.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(submitVoteForCast.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadSubstituteByLeague.fulfilled, (state, action) => {
        state.substitutePlayers = action.payload;
      })
      .addCase(loadSubstituteByLeague.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadPlayersByLeague.fulfilled, (state, action) => {
        state.teamPlayers = action.payload;
      })
      .addCase(loadPlayersByLeague.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadCastersByLeague.fulfilled, (state, action) => {
        state.casters = action.payload;
      })
      .addCase(loadCastersByLeague.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadPlayerDetails.fulfilled, (state, action) => {
        state.playerDetails = action.payload;
      })
      .addCase(loadPlayerDetails.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadTeamsStats.fulfilled, (state, action) => {
        state.teamStats = action.payload;
      })
      .addCase(loadTeamsStats.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(loadMatchTeamDetails.fulfilled, (state, action) => {
        state.matchTeamDetails = action.payload;
      })
      .addCase(loadMatchTeamDetails.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(registerAsSubstitute.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(unRegisterAsSubstitute.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(submitRecruitMe.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      });
  },
});

// Actions
export const {
  setActiveLeague,
  resetActiveLeague,
  setError,
  clearError,
  setFilterRegRank,
  resetFilterRegRank,
  setStandingsLoading,
  resetStandingsLoading,
  setStandingsSearchLoading,
  resetStandingsSearchLoading,
  setPlayerScreenLoading,
  resetPlayerScreenLoading,
  setTeamStatsLoading,
  resetTeamStatsLoading,
  setMatchTeamDetailsLoading,
  resetMatchTeamDetailsLoading,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;

// Selectors
export const getAllLeagues = (state: RootState) => state.tournament.leagues;
export const getActiveLeague = (state: RootState) =>
  state.tournament.activeLeague;

export const getLeagueRegions = (state: RootState) => state.tournament.regions;
export const getLeagueRegionsWithCode = createSelector(
  getLeagueRegions,
  regions => {
    const data = regions.map(region => {
      return {
        ...region,
        code: indexRegionByName[`${region.name}`] ?? "",
      };
    }); 
    data.unshift({ id: "", code: "", name: "Worldwide", icon: "" });
    return data;
  },
);
export const getLeagueSeasons = (state: RootState) => state.tournament.seasons;

export const getLeagueStandings = (state: RootState) =>
  state.tournament.standings;
export const getStandingsLoading = (state: RootState) =>
  state.tournament.standingsLoading;
export const getStandingsSearchLoading = (state: RootState) =>
  state.tournament.standingsSearchLoading;
export const getFilterRegionRank = (state: RootState) =>
  state.tournament.filterRegRank;
export const getLeagueStandingById = createSelector(
  getLeagueStandings,
  (_: RootState, teamId: string) => teamId,
  (standings, teamId) => standings.find(item => item.id === teamId),
);
export const getTeamDetails = (state: RootState) =>
  state.tournament.teamDetails;
export const getTeamPlayers = (state: RootState) =>
  state.tournament.teamDetPlayers;
export const getTeamUpcomingMatches = (state: RootState) =>
  state.tournament.teamUpcomingMatches;
export const getTeamMatchesHistory = (state: RootState) =>
  state.tournament.teamMatchesHistory;

export const getLeagueUpcomingMatches = (state: RootState) =>
  state.tournament.upcomingMatches;
export const getLeagueMatchesHistory = (state: RootState) =>
  state.tournament.pastMatches;
export const getPlayers = (state: RootState) => state.tournament.teamPlayers;
export const getSubstitute = (state: RootState) => state.tournament.substitutePlayers;
export const getCasters = (state: RootState) => state.tournament.casters;
export const getPlayerDetails = (state: RootState) =>
  state.tournament.playerDetails;
export const getPlayerScreenLoading = (state: RootState) =>
  state.tournament.playerScreenLoading;
// export const getMappedStandings = createSelector(
//   getLeagueStandings,
//   standings => standings.map(item => ({
//     rank: item.rank
//   }))
// )

export const getTournamentError = (state: RootState) => state.tournament.error;

export const isUserRegistered = createSelector(
  [getTeams, getCurrentUser, getActiveLeague],
  (teams, user, activeLeague) => {
    if (!user) {
      return false;
    }
    const players: fromModels.Player[] = teams
      .filter(team => team.game.replace(" ", "") === activeLeague?.key)
      .map(team => (team.players ? team.players : []))
      .flat();
    return players.some(player => player.userID === user.id);
  },
);

export const getActiveLeagueTeams = createSelector(
  [getTeams, getActiveLeague],
  (teams, activeLeague) => {
    if (!activeLeague) {
      return [];
    }

    return teams.filter(
      team => team.game.replace(" ", "") === activeLeague.key,
    );
  },
);

export const getActiveLeagueRegionIDsMap = createSelector(
  [getActiveLeagueTeams],
  teams => teams.map(team => team.regionID),
);

export const getMatchStatistics = (state: RootState) =>
  state.tournament.teamStats;

export const getMatchFromPastById = createSelector(
  getLeagueMatchesHistory,
  (_: RootState, matchId: string) => matchId,
  (matches, matchId) => matches.find(match => match.id === matchId),
);

export const getMatchTeamDetails = (state: RootState) =>
  state.tournament.matchTeamDetails;
export const getMatchTeamDetailsLoading = (state: RootState) =>
  state.tournament.matchTeamDetailsLoading;
export const getMatchStatsLoading = (state: RootState) =>
  state.tournament.teamStatsLoading;

export const getRecruitingTeams = createSelector(getLeagueStandings, teams =>
  teams.filter(team => team.isRecruiting),
);
