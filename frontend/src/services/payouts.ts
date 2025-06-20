import { post, patch, del } from "../lib/http";
import { Payout } from "../types/commons";

const PAYOUTS_BASE_URL = "/payouts";

export const payoutsApi = {

  createPayout: async (payload: Payout): Promise<Payout> => {
    const response = await post<Payout, Payout>(
      PAYOUTS_BASE_URL,
      payload
    );
    return response.data;
  },

  updatePayout: async (
    id: string,
    payload: Partial<Payout>
  ): Promise<Payout> => {
    const response = await patch<Payout, Partial<Payout>>(
      `${PAYOUTS_BASE_URL}/${id}`,
      payload
    );
    return response.data;
  },

  deletePayout: async (id: string): Promise<void> => {
    await del<void>(`${PAYOUTS_BASE_URL}/${id}`);
  },
};

