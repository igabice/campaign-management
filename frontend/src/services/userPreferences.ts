import { get, post, put, patch, del } from '../lib/http';
import { UserPreference } from '../types/schemas';

type CreateUserPreferencePayload = {
  emailNotifications?: boolean;
  telegramEnabled?: boolean;
  telegramChatId?: string;
  whatsappEnabled?: boolean;
  whatsappNumber?: string;
  postsPerDay?: number;
  postsPerWeek?: number;
  preferredPostTimes?: string[];
  preferredPostDays?: string[];
  topics?: { topic: string; weight?: number }[];
};

const USER_PREFERENCES_BASE_URL = '/user-preferences';

export const userPreferenceApi = {
  getUserPreferences: async (): Promise<UserPreference> => {
    const response = await get<{ preference: UserPreference }>(USER_PREFERENCES_BASE_URL);
    return response.data.preference;
  },

  createUserPreferences: async (payload: CreateUserPreferencePayload): Promise<UserPreference> => {
    const response = await post<{ preference: UserPreference }, typeof payload>(USER_PREFERENCES_BASE_URL, payload);
    return response.data.preference;
  },

  updateUserPreferences: async (payload: Partial<UserPreference>): Promise<UserPreference> => {
    const response = await put<{ preference: UserPreference }, Partial<UserPreference>>(USER_PREFERENCES_BASE_URL, payload);
    return response.data.preference;
  },

  updateTopics: async (topics: { topic: string; weight?: number }[]): Promise<UserPreference> => {
    const response = await patch<{ preference: UserPreference }, { topics: { topic: string; weight?: number }[] }>(
      `${USER_PREFERENCES_BASE_URL}/topics`,
      { topics }
    );
    return response.data.preference;
  },

  deleteUserPreferences: async (): Promise<void> => {
    await del<void>(USER_PREFERENCES_BASE_URL);
  },
};