import type { Task, TaskStats, UpdateTaskPayload } from '@/types/technician.types';
import api from '@/lib/axios';

// ─── Base path ────────────────────────────────────────────────────────────────
// Lưu ý: api đã có baseURL = VITE_API_URL/api, nên path bắt đầu từ /technician
const BASE = '/technician';

export const technicianApi = {
  // ── Get all tasks assigned to technician ──────────────────────────────────
  getTasks: async (filters?: { status?: string; priority?: string }): Promise<Task[]> => {
    // Lọc bỏ các key undefined để không gửi query param trống
    const params = filters
      ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined))
      : undefined;

    const { data } = await api.get<Task[]>(`${BASE}/tasks`, { params });
    return data;
  },

  // ── Get task statistics ────────────────────────────────────────────────────
  getStats: async (): Promise<TaskStats> => {
    const { data } = await api.get<TaskStats>(`${BASE}/stats`);
    return data;
  },

  // ── Get single task by ID ──────────────────────────────────────────────────
  getTaskById: async (id: string): Promise<Task> => {
    const { data } = await api.get<Task>(`${BASE}/tasks/${id}`);
    return data;
  },

  // ── Update task status / notes / images ───────────────────────────────────
  // Dùng FormData vì có thể gửi kèm file images
  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const formData = new FormData();

    if (payload.status) formData.append('status', payload.status);
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.images) {
      payload.images.forEach((image) => formData.append('images', image));
    }

    // Axios tự set Content-Type: multipart/form-data khi body là FormData
    const { data } = await api.patch<Task>(`${BASE}/tasks/${id}`, formData);
    return data;
  },

  // ── Accept task assignment ─────────────────────────────────────────────────
  acceptTask: async (id: string): Promise<Task> => {
    const { data } = await api.post<Task>(`${BASE}/tasks/${id}/accept`);
    return data;
  },

  // ── Mark task as complete ──────────────────────────────────────────────────
  completeTask: async (id: string, notes: string): Promise<Task> => {
    const { data } = await api.post<Task>(`${BASE}/tasks/${id}/complete`, { notes });
    return data;
  },

  // ── Dashboard: Ticket pipeline counts ─────────────────────────────────────
  getTicketPipeline: async (params?: { from?: string; to?: string }): Promise<{ newReports: number; assigned: number; resolved: number }> => {
    const { data } = await api.get(`${BASE}/dashboard/ticket-pipeline`, { params });
    return data;
  },

  // ── Dashboard: Device health ──────────────────────────────────────────────
  getDeviceHealth: async (): Promise<{ totalAssets: number; healthy: number; maintenance: number; faulty: number; unknown?: number }> => {
    const { data } = await api.get(`${BASE}/dashboard/device-health`);
    return data;
  },

  // ── Ticket Center (reports) ───────────────────────────────────────────────
  getTickets: async (filters?: { status?: string }): Promise<any[]> => {
    const params = filters
      ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined))
      : undefined;

    const { data } = await api.get<any[]>(`${BASE}/tickets`, { params });
    return data;
  },

  // ── Reports (Performance Insights) ─────────────────────────────────────────
  getAllReports: async (): Promise<any[]> => {
    // Backend mounts report routes at /api/tickets
    const { data } = await api.get<any[]>(`/tickets`);
    return data;
  },

  // ── Update ticket/report status (Approve / Reject from dashboards & ticket center) ──
  // IMPORTANT: `id` must be Mongo Report _id and the route lives under reportRoute: /api/tickets/:id/status
  updateTicketStatus: async (
    id: string,
    status: 'pending' | 'approved' | 'rejected' | 'processing' | 'fixed' | 'cancelled',
    outcome?: string,
  ): Promise<any> => {
    const { data } = await api.patch<any>(`/tickets/${id}/status`, { status, outcome });
    return data;
  },
};