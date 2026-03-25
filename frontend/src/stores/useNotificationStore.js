import { create } from "zustand";
import { notificationService } from "@/services/notificationService";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetchedAt: null,

  fetchNotifications: async (force = false) => {
    const state = get();
    // Cache for 60 seconds
    if (!force && !state.loading && state.lastFetchedAt) {
      if (Date.now() - state.lastFetchedAt < 60000) {
        return;
      }
    }

    try {
      set({ loading: true, error: null });
      const data = await notificationService.getNotifications();
      const unread = data.filter((n) => !n.read).length;
      set({
        notifications: data,
        unreadCount: unread,
        lastFetchedAt: Date.now()
      });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Failed to fetch notifications" });
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationService.markAsRead(id);
      set((state) => {
        const updated = state.notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        );
        const unread = updated.filter((n) => !n.read).length;
        return { notifications: updated, unreadCount: unread };
      });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Failed to mark as read" });
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Failed to mark all as read" });
    }
  },

  deleteNotification: async (id) => {
    try {
      await notificationService.deleteNotification(id);
      set((state) => {
        const updated = state.notifications.filter((n) => n._id !== id);
        const unread = updated.filter((n) => !n.read).length;
        return { notifications: updated, unreadCount: unread };
      });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Failed to delete notification" });
    }
  },

  clearAll: async () => {
    try {
      await notificationService.clearAll();
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Failed to clear notifications" });
    }
  },

  isDetailModalOpen: false,
  selectedEntity: null,
  openDetailModal: (type, id) => set({ isDetailModalOpen: true, selectedEntity: { type, id } }),
  closeDetailModal: () => set({ isDetailModalOpen: false, selectedEntity: null }),
}));
