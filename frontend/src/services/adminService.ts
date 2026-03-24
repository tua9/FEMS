import api from "@/lib/axios";
import type { DashboardMetrics } from "@/types/admin.types";

export const adminService = {
  getDashboardStats: async (): Promise<DashboardMetrics> => {
    const res = await api.get("/admin/dashboard/stats");
    return res.data;
  },

  getDashboardChart: async (): Promise<any> => {
    const res = await api.get("/admin/dashboard/chart");
    return res.data;
  },
  getHealthStatus: async (): Promise<any> => {
    const res = await api.get("/admin/dashboard/health");
    return res.data;
  },
  getRecentBorrowRequests: async (): Promise<any[]> => {
    const res = await api.get("/admin/dashboard/borrow-requests");
    return res.data;
  },
  getRecentDamageReports: async (): Promise<any[]> => {
    const res = await api.get("/admin/dashboard/damage-reports");
    return res.data;
  },
};
