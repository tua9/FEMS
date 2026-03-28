import api from '@/lib/axios';

export const attendanceService = {
  checkIn: async (scheduleId) => {
    const res = await api.post('/attendance/check-in', { scheduleId });
    return res.data;
  },

  checkOut: async (scheduleId) => {
    const res = await api.post('/attendance/check-out', { scheduleId });
    return res.data;
  },

  getAttendanceForSchedule: async (scheduleId) => {
    const res = await api.get(`/attendance/${scheduleId}`);
    return res.data;
  },

  getMyCheckInStatus: async (scheduleId) => {
    const res = await api.get(`/attendance/${scheduleId}/status`);
    return res.data;
  },
};
