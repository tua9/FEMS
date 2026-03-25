import api from '@/lib/axios';
export const dashboardService = {
 getLecturerStats: async ()=> {
 const response = await api.get('/dashboard/lecturer/stats');
 return response.data;
 },

 getLecturerActivities: async ()=> {
 const response = await api.get('/dashboard/lecturer/activities');
 return response.data;
 },

 getLecturerUsageStats: async ()=> {
 const response = await api.get('/dashboard/lecturer/usage-stats');
 return response.data;
 },
};
