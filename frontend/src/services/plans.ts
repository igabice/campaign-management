import { get, post, patch, del, getPaginated } from "../lib/http";

const PLANS_BASE_URL = "/plans";

export const plansApi = {
  getAllPlans: async (
    page: number = 1,
    limit: number = 20,
    query?: {
      teamId?: string;
    }
  ) => {
    const response = await getPaginated(PLANS_BASE_URL, {
      params: {
        page,
        limit,
        ...(query && query),
      },
    });
    return response.data;
  },

  getPlanById: async (id: string) => {
    const response = await get(`${PLANS_BASE_URL}/${id}`);
    return response.data;
  },

  createPlan: async (payload: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    tone?: string;
    status?: string;
    teamId: string;
    posts?: {
      title?: string;
      content: string;
      socialMedias: string[];
      scheduledDate: string;
      sendReminder?: boolean;
    }[];
  }) => {
    const response = await post(PLANS_BASE_URL, payload);
    return response.data;
  },

  updatePlan: async (id: string, payload: Partial<{
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    tone?: string;
    status?: string;
  }>) => {
    const response = await patch(`${PLANS_BASE_URL}/${id}`, payload);
    return response.data;
  },

  publishPlan: async (id: string, payload: {
    posts: {
      title?: string;
      content: string;
      socialMedias: string[];
      scheduledDate: string;
      sendReminder?: boolean;
    }[];
  }) => {
    const response = await post(`${PLANS_BASE_URL}/${id}/publish`, payload);
    return response.data;
  },

  deletePlan: async (id: string) => {
    await del(`${PLANS_BASE_URL}/${id}`);
  },
};