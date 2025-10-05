import { get, post, patch, del, getPaginated } from "../lib/http";

const SOCIAL_MEDIA_BASE_URL = "/social-media";

export const socialMediaApi = {
  getAllSocialMedia: async (
    page: number = 1,
    limit: number = 20,
    query?: {
      teamId?: string;
      platform?: string;
      status?: string;
    }
  ) => {
    const response = await getPaginated(SOCIAL_MEDIA_BASE_URL, {
      params: {
        page,
        limit,
        ...(query && query),
      },
    });
    return response.data;
  },

  getSocialMediaById: async (id: string) => {
    const response = await get(`${SOCIAL_MEDIA_BASE_URL}/${id}`);
    return response.data;
  },

  createSocialMedia: async (payload: {
    accountName: string;
    teamId: string;
    platform: string;
    profileLink: string;
    image?: string;
    status?: string;
  }) => {
    const response = await post(SOCIAL_MEDIA_BASE_URL, payload);
    return response.data;
  },

  updateSocialMedia: async (id: string, payload: Partial<{
    accountName: string;
    platform: string;
    profileLink: string;
    image: string;
    status: string;
  }>) => {
    const response = await patch(`${SOCIAL_MEDIA_BASE_URL}/${id}`, payload);
    return response.data;
  },

  deleteSocialMedia: async (id: string) => {
    await del(`${SOCIAL_MEDIA_BASE_URL}/${id}`);
  },
};