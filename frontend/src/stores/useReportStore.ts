import { create } from "zustand";
import type { Report, CreateReportPayload, ReportStatus } from "@/types/report";
import { reportService } from "@/services/reportService";

type ReportStore = {
  reports: Report[];
  myReports: Report[];
  loading: boolean;
  error: string | null;

  fetchAllReports: () => Promise<void>;
  fetchMyReports: () => Promise<void>;
  createReport: (payload: CreateReportPayload) => Promise<void>;
  updateReportStatus: (id: string, status: ReportStatus) => Promise<void>;
};

export const useReportStore = create<ReportStore>((set) => ({
  reports: [],
  myReports: [],
  loading: false,
  error: null,

  fetchAllReports: async () => {
    try {
      set({ loading: true, error: null });
      const data = await reportService.getAll();
      set({ reports: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch reports" });
    } finally {
      set({ loading: false });
    }
  },

  fetchMyReports: async () => {
    try {
      set({ loading: true, error: null });
      const data = await reportService.getPersonalHistory();
      set({ myReports: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch your reports" });
    } finally {
      set({ loading: false });
    }
  },

  createReport: async (payload: CreateReportPayload) => {
    try {
      set({ loading: true, error: null });
      await reportService.create(payload);
      
      // The backend returns only { message, report_id } instead of the full report.
      // We must refetch the history to prevent crashes in the UI (e.g. RecentReports reading report._id).
      const freshMyReports = await reportService.getPersonalHistory();
      set({ myReports: freshMyReports });
      
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot create report" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateReportStatus: async (id: string, status: ReportStatus) => {
    try {
      set({ loading: true, error: null });
      const updated = await reportService.updateStatus(id, status);
      set((state) => ({
        reports: state.reports.map((r) => (r._id === id ? updated : r)),
        myReports: state.myReports.map((r) => (r._id === id ? updated : r))
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot update report status" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
