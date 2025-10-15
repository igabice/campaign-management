import { get, post, patch, del, getPaginated } from "../lib/http";

const POSTS_BASE_URL = "/posts";

export const postsApi = {
  getAllPosts: async (
    page: number = 1,
    limit: number = 20,
    query?: {
      teamId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
    }
  ) => {
    const response = await getPaginated(POSTS_BASE_URL, {
      params: {
        page,
        limit,
        ...(query && query),
      },
    });
    return response.data;
  },

  getPostById: async (id: string) => {
    const response = await get(`${POSTS_BASE_URL}/${id}`);
    return response.data;
  },

  getDashboardAnalytics: async (teamId: string) => {
    const response = await get(`${POSTS_BASE_URL}/dashboard/analytics`, {
      params: { teamId },
    });
    return response.data;
  },

  getUpcomingPosts: async (teamId: string, limit: number = 5) => {
    const response = await get(`${POSTS_BASE_URL}/dashboard/upcoming`, {
      params: { teamId, limit },
    });
    return response.data;
  },

  getRecentActivity: async (teamId: string, limit: number = 5) => {
    const response = await get(`${POSTS_BASE_URL}/dashboard/recent`, {
      params: { teamId, limit },
    });
    return response.data;
  },

  createPost: async (payload: {
    title?: string;
    content: string;
    socialMedias: string[];
    image?: string;
    scheduledDate: string;
    sendReminder?: boolean;
    plannerId?: string;
    teamId: string;
  }) => {
    const response = await post(POSTS_BASE_URL, payload);
    return response.data;
  },

  updatePost: async (id: string, payload: Partial<{
    title?: string;
    content?: string;
    socialMedias?: string[];
    image?: string;
    scheduledDate?: string;
    sendReminder?: boolean;
    plannerId?: string;
    status?: string;
  }>) => {
    const response = await patch(`${POSTS_BASE_URL}/${id}`, payload);
    return response.data;
  },

  deletePost: async (id: string) => {
    await del(`${POSTS_BASE_URL}/${id}`);
  },
};