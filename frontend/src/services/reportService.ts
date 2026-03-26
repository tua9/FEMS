import api from "@/lib/axios";
import type { Report, CreateReportPayload, ReportStatus } from "@/types/report";

export const reportService = {
  create: async (payload: CreateReportPayload): Promise<Report> => {
    const res = await api.post("/tickets/report", payload);
    return res.data.report || res.data;
  },

  getPersonalHistory: async (): Promise<Report[]> => {
    const res = await api.get("/tickets/history");
    return res.data;
  },

  getAll: async (): Promise<Report[]> => {
    const res = await api.get("/tickets");
    return res.data;
  },

  updateStatus: async (id: string, status: ReportStatus, technicianId?: string): Promise<Report> => {
    const res = await api.patch(`/tickets/${id}/status`, { status, technicianId });
    return res.data.report || res.data;
  },

  cancelReport: async (id: string, decisionNote: string): Promise<Report> => {
    const res = await api.delete(`/tickets/history/${id}`, { data: { decision_note: decisionNote } });
    return res.data.report || res.data;
  },

  getById: async (id: string): Promise<Report> => {
    const res = await api.get(`/tickets/${id}`);
    return res.data;
  },

};
