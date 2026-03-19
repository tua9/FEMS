import { create } from 'zustand';
import type { LecturerStats, RecentActivity, UsageStatsData } from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';

interface DashboardState {
    stats: LecturerStats | null;
    activities: RecentActivity[];
    usageStats: UsageStatsData | null;
    isLoading: boolean;
    error: string | null;

    fetchStats: () => Promise<void>;
    fetchActivities: () => Promise<void>;
    fetchUsageStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    stats: null,
    activities: [],
    usageStats: null,
    isLoading: false,
    error: null,

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const stats = await dashboardService.getLecturerStats();
            set({ stats, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch stats', isLoading: false });
        }
    },

    fetchActivities: async () => {
        set({ isLoading: true, error: null });
        try {
            const activities = await dashboardService.getLecturerActivities();
            set({ activities, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch activities', isLoading: false });
        }
    },

    fetchUsageStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const usageStats = await dashboardService.getLecturerUsageStats();
            set({ usageStats, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch usage stats', isLoading: false });
        }
    },
}));
