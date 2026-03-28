import { create } from 'zustand';
import { scheduleService } from '../services/scheduleService';

export const useScheduleStore = create((set) => ({
    schedules: [],
    isLoading: false,
    error: null,

    fetchSchedules: async (date) => {
        set({ isLoading: true, error: null });
        try {
            const schedules = await scheduleService.getMySchedules(date);
            set({ schedules, isLoading: false });
        } catch (error) {
            set({ error: error.message || 'Failed to fetch schedules', isLoading: false });
        }
    },

    addSchedule: async (payload) => {
        try {
            await scheduleService.createSchedule(payload);
            // Re-fetch to keep it synced with backend
            const schedules = await scheduleService.getMySchedules();
            set({ schedules });
        } catch (error) {
            set({ error: error.message || 'Failed to add schedule' });
        }
    },

    removeSchedule: async (id) => {
        try {
            await scheduleService.deleteSchedule(id);
            set((state) => ({
                schedules: state.schedules.filter((s) => s._id !== id),
            }));
        } catch (error) {
            set({ error: error.message || 'Failed to delete schedule' });
        }
    },
}));
