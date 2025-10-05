import { get, post, patch, del, getPaginated } from "../lib/http";
import { Team } from "../types/commons";
import { PaginatedResponse } from "../types/commons";

const TEAMS_BASE_URL = "/teams";

export const teamsApi = {
  getAllTeams: async (
    page: number = 1,
    limit: number = 20,
    query?: {
      isRunning?: boolean | null;
      searchTerm?: string;
    }
  ): Promise<PaginatedResponse<Team>> => {
    const response = await getPaginated<Team>(TEAMS_BASE_URL, {
      params: {
        page,
        limit,
        ...(query && query),
      },
    });
    return response.data;
  },

  getTeamById: async (id: string): Promise<Team> => {
    const response = await get<Team>(`${TEAMS_BASE_URL}/${id}`);
    return response.data;
  },

  createTeam: async (payload: Partial<Team>): Promise<Team> => {
    const response = await post<Team, Partial<Team>>(TEAMS_BASE_URL, payload);
    return response.data;
  },

  updateTeam: async (id: string, payload: Partial<Team>): Promise<Team> => {
    const response = await patch<Team, Partial<Team>>(
      `${TEAMS_BASE_URL}/${id}`,
      payload
    );
    return response.data;
  },

  deleteTeam: async (id: string): Promise<void> => {
    await del<void>(`${TEAMS_BASE_URL}/${id}`);
  },

  getMyTeams: async (): Promise<any[]> => {
    const response = await get<any[]>(`${TEAMS_BASE_URL}/mine`);
    return response.data;
  },

  getTeamMembers: async (teamId: string): Promise<any[]> => {
    const response = await get<any[]>(`${TEAMS_BASE_URL}/${teamId}/members`);
    return response.data;
  },

  getTeamInvites: async (teamId: string): Promise<any[]> => {
    const response = await get<any>(`/invites?teamId=${teamId}`);
    return response.data.result;
  },
};
