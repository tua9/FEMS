import api from '@/lib/axios';
export const scheduleService = {
 getMySchedules: async (date)=> {
 const params = date ? { date } : {};
 const response = await api.get('/schedules/me', { params });
 return response.data;
 },

 createSchedule: async (payload)=> {
 const response = await api.post('/schedules', payload);
 return response.data;
 },

 updateSchedule: async (id, payload)=> {
 const response = await api.patch(`/schedules/${id}`, payload);
 return response.data;
 },

 deleteSchedule: async (id)=> {
 await api.delete(`/schedules/${id}`);
 },
};
