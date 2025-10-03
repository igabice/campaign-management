import { get, post, patch, del, getPaginated } from "../lib/http";
import { Campaign } from "../types/commons";
import { PaginatedResponse } from "../types/commons";

const CAMPAIGNS_BASE_URL = "/v1/campaigns";

export const campaignsApi = {

  getAllCampaigns: async (
    page: number = 1,
    limit: number = 20,
      query?: {
          isRunning?: boolean| null,
          searchTerm?: string
      }
  ): Promise<PaginatedResponse<Campaign>> => {
    const response = await getPaginated<Campaign>(CAMPAIGNS_BASE_URL, {
      params: {
        page,
        limit,
        ...(query && query)
      }
    });
    return response.data;
  },

  getCampaignById: async (id: string): Promise<Campaign> => {
    const response = await get<Campaign>(`${CAMPAIGNS_BASE_URL}/${id}`);
    return response.data;
  },

  createCampaign: async (payload: Partial<Campaign>): Promise<Campaign> => {
    const response = await post<Campaign, Partial<Campaign>>(
      CAMPAIGNS_BASE_URL,
      payload
    );
    return response.data;
  },

  updateCampaign: async (
    id: string,
    payload: Partial<Campaign>
  ): Promise<Campaign> => {
    const response = await patch<Campaign, Partial<Campaign>>(
      `${CAMPAIGNS_BASE_URL}/${id}`,
      payload
    );
    return response.data;
  },

  deleteCampaign: async (id: string): Promise<void> => {
    await del<void>(`${CAMPAIGNS_BASE_URL}/${id}`);
  },
};

