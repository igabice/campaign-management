import { post } from "../lib/http";

export const aiApi = {
  generateContentPlan: async (payload: {
    topicPreferences: string[];
    postFrequency: string;
    title: string;
    description: string;
    tone: string;
  }) => {
    const response = await post('/ai/generate-content-plan', payload);
    return response.data;
  },
};