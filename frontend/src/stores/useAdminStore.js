import { create } from "zustand";
import { adminService } from "@/services/adminService";

export const useAdminStore = create((set) => ({
  stats: null,
  chartData: null,
  healthStatus: null,
  borrowRequests: [],
  damageReports: [],
  equipmentAnalytics: null,
  reportAnalytics: null,
  technicianPerformance: null,
  activeBorrowing: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    try {
      set({ loading: true, error: null });
      const data = await adminService.getDashboardStats();
      set({ stats: data });
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch damage reports" });
    } finally {
      set({ loading: false });
    }
  },

  fetchEquipmentAnalytics: async () => {
    try {
      const data = await adminService.getEquipmentAnalytics();
      set({ equipmentAnalytics: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch equipment analytics" });
    }
  },

  fetchReportAnalytics: async () => {
    try {
      const data = await adminService.getReportAnalytics();
      set({ reportAnalytics: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch report analytics" });
    }
  },

  fetchTechnicianPerformance: async () => {
    try {
      const data = await adminService.getTechnicianPerformance();
      set({ technicianPerformance: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch technician performance" });
    }
  },

  fetchActiveBorrowing: async () => {
    try {
      const data = await adminService.getActiveBorrowing();
      set({ activeBorrowing: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch active borrowing" });
    }
  },
}));
