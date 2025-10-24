import { post } from "../lib/http";

export const aiApi = {
  generateContentPlan: async (payload: {
    topicPreferences: string[];
    postFrequency: string;
    title: string;
    description: string;
    tone: string;
  }) => {
    const maxRetries = 2;
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await post('/ai/generate-content-plan', payload);
        return response.data;
      } catch (error: any) {
        lastError = error;
        // Don't retry on client errors (4xx) or if it's the last attempt
        if ((error.response?.status >= 400 && error.response?.status < 500) || attempt === maxRetries) {
          throw error;
        }
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    throw lastError;
  },
};