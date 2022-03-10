import axios from "axios";
import { API_BASE_URL, SUBSTITUTE_URL } from "../../../config";
import { api } from "../../../utils";
import { User } from "../../auth/models";
import {
  IPatchJson,
  IRegion,
  Match,
  MyMatches,
  MyTeams,
  PendingRectruit,
  Team,
} from "../models";

const UPDATE_PROFILE = `/User`;
const MODIFY_LOGO = `/User/Logo`;
const MY_TEAMS = `/User/@MyTeams`;
const MY_MATCHES = `/User/@MyMatches`;
const TEAMS_PREFIX = `/Teams`;

export const updateLogo = async (data: FormData, token: string) => {
  return await handleUploadLogo(`${MODIFY_LOGO}`, data, token);
};

export const myTeams = async (): Promise<MyTeams> => {
  return await api().get<MyTeams, MyTeams>(`${MY_TEAMS}`);
};

export const updateTeamsLogo = async (
  teamId: string,
  data: FormData,
  token: string,
) => {
  return await handleUploadLogo(`${TEAMS_PREFIX}/${teamId}/logo`, data, token);
};

export const fetchGameRegions = async (game: string) => {
  return await api().get<IRegion[]>(`${game}/Regions`);
};

export const modifyTeam = async (teamId: string, data: IPatchJson[]) => {
  return await api().patch(`${TEAMS_PREFIX}/${teamId}`, data, {
    ...axios.defaults,
    headers: {
      ...axios.defaults.headers,
      "Content-Type": "application/json-patch+json",
    },
  });
};

export const leaveTeam = async (team: Team): Promise<Team> => {
  return await api().delete(`${TEAMS_PREFIX}/${team.id}`);
};

export const myMatches = async (): Promise<MyMatches> => {
  return await api().get<any, MyMatches>(`${MY_MATCHES}`);
};

export const updateUser = async (data: IPatchJson[], userId: string) => {
  return await api().patch(`${UPDATE_PROFILE}/${userId}`, data, {
    ...axios.defaults,
    headers: {
      ...axios.defaults.headers,
      "Content-Type": "application/json-patch+json",
    },
  });
};

const handleUploadLogo = async (url: string, data: FormData, token: string) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Content-Type": `multipart/form-data`,
      Authorization: `Bearer ${token}`,
    },
  });

  return await instance.post(`${url}`, data);
};
