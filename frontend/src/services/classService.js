import api from '@/lib/axios';

export const classService = {
  getAllClasses: async () => {
    const res = await api.get('/classes');
    return res.data;
  },

  getClassById: async (id) => {
    const res = await api.get(`/classes/${id}`);
    return res.data;
  },

  createClass: async (payload) => {
    const res = await api.post('/classes', payload);
    return res.data;
  },

  updateClass: async (id, payload) => {
    const res = await api.patch(`/classes/${id}`, payload);
    return res.data;
  },

  deleteClass: async (id) => {
    await api.delete(`/classes/${id}`);
  },
};
