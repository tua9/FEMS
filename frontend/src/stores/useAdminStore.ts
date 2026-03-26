import { create } from "zustand";
import type { DashboardMetrics, HealthStatus, RecentBorrowRequest, RecentDamageReport } from "@/types/admin.types";
import { adminService } from "@/services/adminService";

type AdminStore = {
  stats: DashboardMetrics | null;
  chartData: any | null;
  healthStatus: HealthStatus | null;
  borrowRequests: RecentBorrowRequest[];
  damageReports: RecentDamageReport[];
  loading: boolean;
  error: string | null;

  fetchStats: () => Promise<void>;
  fetchChartData: () => Promise<void>;
  fetchHealthStatus: () => Promise<void>;
  fetchBorrowRequests: () => Promise<void>;
  fetchDamageReports: () => Promise<void>;
};

export const useAdminStore = create<AdminStore>((set) => ({
  stats: null,
  chartData: null,
  healthStatus: null,
  borrowRequests: [],
  damageReports: [],
  loading: false,
  error: null,

  fetchStats: async () => {
    try {
      set({ loading: true, error: null });
      const data = await adminService.getDashboardStats();
      set({ stats: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch dashboard stats" });
    } finally {
      set({ loading: false });
    }
  },

  fetchChartData: async () => {
    try {
      set({ loading: true, error: null });
      const data = await adminService.getDashboardChart();
      set({ chartData: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch dashboard chart" });
    } finally {
      set({ loading: false });
    }
  },

  fetchHealthStatus: async () => {
    try {
      set({ loading: true, error: null });
      const data = await adminService.getHealthStatus();
      set({ healthStatus: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch health status" });
    } finally {
      set({ loading: false });
    }
  },

  fetchBorrowRequests: async () => {
    try {
      set({ loading: true, error: null });
      const data = await adminService.getRecentBorrowRequests();
      set({ borrowRequests: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch borrow requests" });
    } finally {
      set({ loading: false });
    }
  },

  fetchDamageReports: async () => {
    try {
      set({ loading: true, error: null });
      const data = await adminService.getRecentDamageReports();
      set({ damageReports: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch damage reports" });
    } finally {
      set({ loading: false });
    }
  },
}));
