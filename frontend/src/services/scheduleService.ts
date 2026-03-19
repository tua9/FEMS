import api from '@/lib/axios';
import type { Schedule, CreateSchedulePayload } from '../types/schedule';

export const scheduleService = {
    getMySchedules: async (date?: string): Promise<Schedule[]> => {
        const params = date ? { date } : {};
        const response = await api.get('/schedules', { params });
        return response.data;
    },

    createSchedule: async (payload: CreateSchedulePayload): Promise<Schedule> => {
        const response = await api.post('/schedules', payload);
        return response.data;
    },

    updateSchedule: async (id: string, payload: Partial<CreateSchedulePayload>): Promise<Schedule> => {
        const response = await api.patch(`/schedules/${id}`, payload);
        return response.data;
    },

    deleteSchedule: async (id: string): Promise<void> => {
        await api.delete(`/schedules/${id}`);
    },
};
