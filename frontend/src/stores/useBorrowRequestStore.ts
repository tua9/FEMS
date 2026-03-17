import { create } from "zustand";
import { borrowRequestService } from "@/services/borrowRequestService";
import type {
  BorrowRequest,
  CreateBorrowRequestPayload,
} from "@/types/borrowRequest";

type BorrowRequestStore = {
  borrowRequests: BorrowRequest[];
  pendingBorrowRequests: BorrowRequest[];
  approvedByMe: BorrowRequest[];
  selectedBorrowRequest: BorrowRequest | null;
  loading: boolean;
  error: string | null;

  fetchMyBorrowRequests: () => Promise<void>;
  fetchPendingBorrowRequests: () => Promise<void>;
  fetchApprovedByMe: () => Promise<void>;
  fetchBorrowRequestById: (id: string) => Promise<void>;
  createMyBorrowRequest: (payload: CreateBorrowRequestPayload) => Promise<void>;
  cancelMyBorrowRequest: (id: string) => Promise<void>;
  approveBorrowRequest: (id: string) => Promise<void>;
  rejectBorrowRequest: (id: string, reason?: string) => Promise<void>;
  clearBorrowRequests: () => void;
  clearSelectedBorrowRequest: () => void;
};

export const useBorrowRequestStore = create<BorrowRequestStore>((set) => ({
  borrowRequests: [],
  pendingBorrowRequests: [],
  approvedByMe: [],
  selectedBorrowRequest: null,
  loading: false,
  error: null,

  fetchMyBorrowRequests: async () => {
    try {
      set({ loading: true, error: null });
      const data = await borrowRequestService.getMyBorrowRequests();
      set({ borrowRequests: data });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Không tải được danh sách borrow request",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchApprovedByMe: async () => {
    try {
      set({ loading: true, error: null });
      const data = await borrowRequestService.getApprovedByMe();
      set({ approvedByMe: data });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Không tải được lịch sử phê duyệt",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchPendingBorrowRequests: async () => {
    try {
      set({ loading: true, error: null });
      const data = await borrowRequestService.getPendingBorrowRequests();
      set({ pendingBorrowRequests: data });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Không tải được danh sách yêu cầu chờ duyệt",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchBorrowRequestById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const data = await borrowRequestService.getBorrowRequestById(id);
      set({ selectedBorrowRequest: data });
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message ||
          "Không tải được chi tiết borrow request",
      });
    } finally {
      set({ loading: false });
    }
  },

  createMyBorrowRequest: async (payload: CreateBorrowRequestPayload) => {
    try {
      set({ loading: true, error: null });
      await borrowRequestService.createBorrowRequest(payload);
      // Do NOT refetch here — caller (component) is responsible for refreshing
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Không tạo được borrow request",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  cancelMyBorrowRequest: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await borrowRequestService.cancelBorrowRequest(id);

      set((state) => ({
        borrowRequests: state.borrowRequests.filter((item) => item._id !== id),
        selectedBorrowRequest:
          state.selectedBorrowRequest?._id === id
            ? null
            : state.selectedBorrowRequest,
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Không hủy được borrow request",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  approveBorrowRequest: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await borrowRequestService.approveBorrowRequest(id);

      set((state) => ({
        pendingBorrowRequests: state.pendingBorrowRequests.filter(
          (item) => item._id !== id
        ),
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Không thể phê duyệt yêu cầu",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  rejectBorrowRequest: async (id: string, reason?: string) => {
    try {
      set({ loading: true, error: null });
      await borrowRequestService.rejectBorrowRequest(id, reason);

      set((state) => ({
        pendingBorrowRequests: state.pendingBorrowRequests.filter(
          (item) => item._id !== id
        ),
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Không thể từ chối yêu cầu",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearBorrowRequests: () => {
    set({
      borrowRequests: [],
      error: null,
    });
  },

  clearSelectedBorrowRequest: () => {
    set({
      selectedBorrowRequest: null,
    });
  },
}));