import { get, post, patch, del, getPaginated } from "../lib/http";

const INVITES_BASE_URL = "/invites";

export const invitesApi = {
  getAllInvites: async (
    page: number = 1,
    limit: number = 20,
    query?: {
      teamId?: string;
      status?: string;
    }
  ) => {
    const response = await getPaginated(INVITES_BASE_URL, {
      params: {
        page,
        limit,
        ...(query && query),
      },
    });
    return response.data;
  },

  getInviteById: async (id: string) => {
    const response = await get(`${INVITES_BASE_URL}/${id}`);
    return response.data;
  },

  createInvite: async (payload: {
    email: string;
    teamId: string;
  }) => {
    const response = await post(INVITES_BASE_URL, payload);
    return response.data;
  },

  updateInvite: async (id: string, payload: Partial<{
    status: string;
  }>) => {
    const response = await patch(`${INVITES_BASE_URL}/${id}`, payload);
    return response.data;
  },

  deleteInvite: async (id: string) => {
    await del(`${INVITES_BASE_URL}/${id}`);
  },

  respondToInvite: async (id: string, action: "accept" | "decline") => {
    const response = await post(`${INVITES_BASE_URL}/${id}/respond`, { action });
    return response.data;
  },

  resendInvite: async (id: string) => {
    const response = await post(`${INVITES_BASE_URL}/${id}/resend`);
    return response.data;
  },
};