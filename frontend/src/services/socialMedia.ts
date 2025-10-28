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

  updateSocialMedia: async (
    id: string,
    payload: Partial<{
      accountName: string;
      platform: string;
      profileLink: string;
      image: string;
      status: string;
    }>
  ) => {
    const response = await patch(`${SOCIAL_MEDIA_BASE_URL}/${id}`, payload);
    return response.data;
  },

  deleteSocialMedia: async (id: string) => {
    await del(`${SOCIAL_MEDIA_BASE_URL}/${id}`);
  },

  // Facebook-specific methods
  getFacebookPages: async () => {
    const response = await get(`${SOCIAL_MEDIA_BASE_URL}/facebook/pages`);
    return response.data;
  },

  saveFacebookPages: async (payload: {
    teamId: string;
    pages: Array<{
      id: string;
      name: string;
      access_token: string;
      category?: string;
      tasks?: string[];
    }>;
  }) => {
    const response = await post(
      `${SOCIAL_MEDIA_BASE_URL}/facebook/pages`,
      payload
    );
    return response.data;
  },

  postToFacebookPage: async (payload: {
    socialMediaId: string;
    content: {
      message: string;
      link?: string;
      image?: string;
    };
  }) => {
    const response = await post(
      `${SOCIAL_MEDIA_BASE_URL}/facebook/post`,
      payload
    );
    return response.data;
  },

  refreshFacebookTokens: async (socialMediaId: string) => {
    const response = await post(
      `${SOCIAL_MEDIA_BASE_URL}/${socialMediaId}/facebook/refresh`
    );
    return response.data;
  },
};
