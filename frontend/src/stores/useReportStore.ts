import { create } from "zustand";
import type { Report, CreateReportPayload, ReportStatus } from "@/types/report";
import { reportService } from "@/services/reportService";

type ReportStore = {
  reports: Report[];
  myReports: Report[];
  loading: boolean;
  actionLoading: boolean;
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
  actionLoading: false,
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
      set({ actionLoading: true, error: null });
      const response = await reportService.create(payload);
      // Ensure we extract the report object if backend returns a wrapper
      const newReport = (response as any).report || response;
      set((state) => ({
        reports: [newReport, ...state.reports],
        myReports: [newReport, ...state.myReports]
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot create report" });
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  updateReportStatus: async (id: string, status: ReportStatus) => {
    try {
      // Use actionLoading instead of loading to avoid full-page spinner
      set({ actionLoading: true, error: null });
      const response = await reportService.updateStatus(id, status);
      // Ensure we extract the report object if backend returns a wrapper
      const updated = (response as any).report || response;
      set((state) => ({
        reports: state.reports.map((r) => (r._id === id ? updated : r)),
        myReports: state.myReports.map((r) => (r._id === id ? updated : r))
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot update report status" });
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },
}));
