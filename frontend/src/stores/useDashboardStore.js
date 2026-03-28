import { create } from 'zustand';
import { dashboardService } from '../services/dashboardService';

export const useDashboardStore = create((set) => ({
    stats: null,
    activities: [],
    isLoading: false,
    error: null,

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const stats = await dashboardService.getLecturerStats();
            set({ stats, isLoading: false });
        } catch (error) {
            set({ error: error.message || 'Failed to fetch stats', isLoading: false });
        }
    },

    fetchActivities: async () => {
        set({ isLoading: true, error: null });
        try {
            const activities = await dashboardService.getLecturerActivities();
            set({ activities, isLoading: false });
        } catch (error) {
            set({ error: error.message || 'Failed to fetch activities', isLoading: false });
        }
    },

}));
