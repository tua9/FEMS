import api from '@/lib/axios';
import type { LecturerStats, RecentActivity, UsageStatsData } from '../types/dashboard';

export const dashboardService = {
    getLecturerStats: async (): Promise<LecturerStats> => {
        const response = await api.get('/dashboard/lecturer/stats');
        return response.data;
    },

    getLecturerActivities: async (): Promise<RecentActivity[]> => {
        const response = await api.get('/dashboard/lecturer/activities');
        return response.data;
    },

    getLecturerUsageStats: async (): Promise<UsageStatsData> => {
        const response = await api.get('/dashboard/lecturer/usage-stats');
        return response.data;
    },
};
