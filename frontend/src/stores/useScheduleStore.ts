import { create } from 'zustand';
import type { Schedule, CreateSchedulePayload } from '../types/schedule';
import { scheduleService } from '../services/scheduleService';

interface ScheduleState {
    schedules: Schedule[];
    isLoading: boolean;
    error: string | null;

    fetchSchedules: (date?: string) => Promise<void>;
    addSchedule: (payload: CreateSchedulePayload) => Promise<void>;
    removeSchedule: (id: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
    schedules: [],
    isLoading: false,
    error: null,

    fetchSchedules: async (date?: string) => {
        set({ isLoading: true, error: null });
        try {
            const schedules = await scheduleService.getMySchedules(date);
            set({ schedules, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch schedules', isLoading: false });
        }
    },

    addSchedule: async (payload) => {
        try {
            await scheduleService.createSchedule(payload);
            // Re-fetch to keep it synced with backend
            const schedules = await scheduleService.getMySchedules();
            set({ schedules });
        } catch (error: any) {
            set({ error: error.message || 'Failed to add schedule' });
        }
    },

    removeSchedule: async (id) => {
        try {
            await scheduleService.deleteSchedule(id);
            set((state) => ({
                schedules: state.schedules.filter((s) => s._id !== id),
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete schedule' });
        }
    },
}));
