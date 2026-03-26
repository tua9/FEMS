import api from '@/lib/axios';

export const scheduleService = {
  /**
   * Personal schedules (lecturer / student).
   * Accepts a date string OR a params object { date } | { startDate, endDate }.
   */
  getMySchedules: async (dateOrParams) => {
    let params = {};
    if (typeof dateOrParams === 'string') {
      params = { date: dateOrParams };
    } else if (dateOrParams && typeof dateOrParams === 'object') {
      params = dateOrParams;
    }
    const response = await api.get('/schedules/me', { params });
    return response.data;
  },

  /**
   * All schedules (admin / lecturer).
   * Accepts params: { date } | { startDate, endDate } | { lecturerId } | { roomId }
   */
  getAllSchedules: async (params = {}) => {
    const response = await api.get('/schedules', { params });
    return response.data;
  },

  createSchedule: async (payload) => {
    const response = await api.post('/schedules', payload);
    return response.data;
  },

  updateSchedule: async (id, payload) => {
    const response = await api.patch(`/schedules/${id}`, payload);
    return response.data;
  },

  deleteSchedule: async (id) => {
    await api.delete(`/schedules/${id}`);
  },
};
