import { create } from "zustand";
import { reportService } from "@/services/reportService";
import { useAuthStore } from "@/stores/useAuthStore";

export const useReportStore = create((set, get) => ({
  reports: [],
  myReports: [],
  loading: false,
  actionLoading: false,
  error: null,

  fetchAllReports: async () => {
    if (get().loading) return;
    try {
      set({ loading: true, error: null });
      const data = await reportService.getAll();
      set({ reports: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch reports" });
    } finally {
      set({ loading: false });
    }
  },

  fetchMyReports: async () => {
    if (get().loading) return;
    try {
      set({ loading: true, error: null });
      const data = await reportService.getPersonalHistory();
      set({ myReports: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch your reports" });
    } finally {
      set({ loading: false });
    }
  },

  createReport: async (payload) => {
    try {
      set({ actionLoading: true, error: null });
      // Backend returns { message, report_id, report: populated }
      const data = await reportService.create(payload);
      const newReport = data?.report;

      if (newReport) {
        set((state) => ({
          reports: [newReport, ...state.reports],
          myReports: [newReport, ...state.myReports],
        }));
      }

      return data; // always return full { message, report_id, report }
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot create report" });
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  updateReportStatus: async (id, status, technicianId) => {
    try {
      // Use actionLoading instead of loading to avoid full-page spinner
      set({ actionLoading: true, error: null });
      const response = await reportService.updateStatus(id, status, technicianId);
      // Ensure we extract the report object if backend returns a wrapper
      const updated = response.report || response;
      set((state) => ({
        reports: state.reports.map((r) => (r._id === id ? updated : r)),
        myReports: state.myReports.map((r) => (r._id === id ? updated : r))
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot update report status" });
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  cancelMyReport: async (id, decisionNote) => {
    try {
      set({ loading: true, error: null });
      await reportService.cancelReport(id, decisionNote);
      // Update status in-place so the row stays visible with status 'cancelled'
      set((state) => ({
        myReports: state.myReports.map((r) =>
          r._id === id ? { ...r, status: 'cancelled' } : r
        ),
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot cancel report" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
