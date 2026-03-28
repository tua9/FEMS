import api from '@/lib/axios';

// ─── Base path ────────────────────────────────────────────────────────────────
// Lưu ý: api đã có baseURL = VITE_API_URL/api, nên path bắt đầu từ /technician
const BASE = '/technician';

export const technicianApi = {
 // ── Get all tasks assigned to technician ──────────────────────────────────
 getTasks: async (filters)=> {
 // Lọc bỏ các key undefined để không gửi query param trống
 const params = filters
 ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined))
 : undefined;

 const { data } = await api.get(`${BASE}/tasks`, { params });
 return data;
 },

 // ── Get task statistics ────────────────────────────────────────────────────
 getStats: async ()=> {
 const { data } = await api.get(`${BASE}/stats`);
 return data;
 },

 // ── Get single task by ID ──────────────────────────────────────────────────
 getTaskById: async (id)=> {
 const { data } = await api.get(`${BASE}/tasks/${id}`);
 return data;
 },

 // ── Update task status / notes / images ───────────────────────────────────
 // Dùng FormData vì có thể gửi kèm file images
 updateTask: async (id, payload)=> {
 const formData = new FormData();

 if (payload.status) formData.append('status', payload.status);
 if (payload.notes) formData.append('notes', payload.notes);
 if (payload.images) {
 payload.images.forEach((image) => formData.append('images', image));
 }

 // Axios tự set Content-Type: multipart/form-data khi body là FormData
 const { data } = await api.patch(`${BASE}/tasks/${id}`, formData);
 return data;
 },

 // ── Accept task assignment ─────────────────────────────────────────────────
 acceptTask: async (id)=> {
 const { data } = await api.post(`${BASE}/tasks/${id}/accept`);
 return data;
 },

 // ── Mark task as complete ──────────────────────────────────────────────────
 completeTask: async (id, notes)=> {
 const { data } = await api.post(`${BASE}/tasks/${id}/complete`, { notes });
 return data;
 },

 // ── Dashboard: Ticket pipeline counts ─────────────────────────────────────
 getTicketPipeline: async (params)=> {
 const { data } = await api.get(`${BASE}/dashboard/ticket-pipeline`, { params });
 return data;
 },

 // ── Dashboard: Device health ──────────────────────────────────────────────
 getDeviceHealth: async ()=> {
 const { data } = await api.get(`${BASE}/dashboard/device-health`);
 return data;
 },

 // ── Ticket Center (reports) ───────────────────────────────────────────────
 getTickets: async (filters)=> {
 const params = filters
 ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined))
 : undefined;

 const { data } = await api.get(`${BASE}/tickets`, { params });
 return data;
 },

 // ── Reports (Performance Insights) ─────────────────────────────────────────
 getAllReports: async ()=> {
 const { data } = await api.get(`/tickets`);
 return data;
 },

 // ── Update ticket status (approve / reject / start / fix) ─────────────────
 updateTicket: async (id, payload)=> {
 const { data } = await api.patch(`${BASE}/tickets/${id}`, payload);
 return data;
 },

 // ── Dashboard analytics ───────────────────────────────────────────────────
 getEquipmentAnalytics: async ()=> {
 const { data } = await api.get(`${BASE}/dashboard/equipment-analytics`);
 return data;
 },

 getReportAnalytics: async ()=> {
 const { data } = await api.get(`${BASE}/dashboard/report-analytics`);
 return data;
 },

 // ── Equipment CRUD ────────────────────────────────────────────────────────
 listEquipment: async (params)=> {
 const { data } = await api.get('/equipments', { params });
 return data;
 },

 createEquipment: async (body)=> {
 const { data } = await api.post('/equipments', body);
 return data;
 },

 updateEquipment: async (id, body)=> {
 const { data } = await api.patch(`/equipments/${id}`, body);
 return data;
 },

 deleteEquipment: async (id)=> {
 const { data } = await api.delete(`/equipments/${id}`);
 return data;
 },

  // ── Equipment repair reports ──────────────────────────────────────────────
 getEquipmentReports: async (params)=> {
 const { data } = await api.get(`${BASE}/tickets`, { params });
 return data;
 },

  // ── Mark equipment as broken (transactional: updates equipment + creates repair report) ──
  markEquipmentBroken: async (id) => {
    const { data } = await api.patch(`/equipments/${id}/mark-broken`);
    return data;
  },
};
