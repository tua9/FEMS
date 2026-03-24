import api from "@/lib/axios";
import type { Notification } from "@/types/notification";

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const res = await api.get("/notifications");
    return res.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead(): Promise<{ message: string }> {
    const res = await api.patch("/notifications/mark-all-read");
    return res.data;
  },

  async deleteNotification(id: string): Promise<{ message: string }> {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },

  async clearAll(): Promise<{ message: string }> {
    const res = await api.delete("/notifications/clear-all");
    return res.data;
  },
  
  async broadcast(data: any): Promise<{ message: string }> {
    const res = await api.post("/notifications/broadcast", data);
    return res.data;
  },
};
