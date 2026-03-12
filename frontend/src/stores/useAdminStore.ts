import { create } from "zustand";
import type { DashboardMetrics } from "@/types/admin.types";
import { adminService } from "@/services/adminService";

type AdminStore = {
  stats: DashboardMetrics | null;
  chartData: any | null;
  loading: boolean;
  error: string | null;

  fetchStats: () => Promise<void>;
  fetchChartData: () => Promise<void>;
};

export const useAdminStore = create<AdminStore>((set) => ({
  stats: null,
  chartData: null,
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
}));
