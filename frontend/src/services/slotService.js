import api from '@/lib/axios';

export const slotService = {
  getAllSlots: async () => {
    const res = await api.get('/slots');
    return res.data;
  },

  getSlotById: async (id) => {
    const res = await api.get(`/slots/${id}`);
    return res.data;
  },

  createSlot: async (payload) => {
    const res = await api.post('/slots', payload);
    return res.data;
  },

  updateSlot: async (id, payload) => {
    const res = await api.patch(`/slots/${id}`, payload);
    return res.data;
  },

  deleteSlot: async (id) => {
    await api.delete(`/slots/${id}`);
  },
};
