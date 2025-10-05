import { get, put } from "../lib/http";

export interface Notification {
  id: string;
  userId: string;
  objectId?: string;
  objectType?: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationsApi = {
  getNotifications: async (unread?: boolean): Promise<Notification[]> => {
    const params = unread ? { unread: "true" } : {};
    const response = await get("/notifications", { params });
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await put("/notifications/read-all");
  },
};