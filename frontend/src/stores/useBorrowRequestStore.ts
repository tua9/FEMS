import { create } from "zustand";
import { borrowRequestService } from "@/services/borrowRequestService";
import type {
  BorrowRequest,
  CreateBorrowRequestPayload,
} from "@/types/borrowRequest";

type BorrowRequestStore = {
  borrowRequests: BorrowRequest[];
  selectedBorrowRequest: BorrowRequest | null;
  loading: boolean;
  error: string | null;

  fetchMyBorrowRequests: () => Promise<void>;
  fetchBorrowRequestById: (id: string) => Promise<void>;
  createMyBorrowRequest: (payload: CreateBorrowRequestPayload) => Promise<void>;
  cancelMyBorrowRequest: (id: string, decisionNote: string) => Promise<void>;
  fetchAllBorrowRequests: () => Promise<void>;
  approveBorrowRequest: (id: string) => Promise<void>;
  rejectBorrowRequest: (id: string) => Promise<void>;
  handoverBorrowRequest: (id: string) => Promise<void>;
  returnBorrowRequest: (id: string) => Promise<void>;
  clearBorrowRequests: () => void;
  clearSelectedBorrowRequest: () => void;
};

export const useBorrowRequestStore = create<BorrowRequestStore>((set) => ({
  borrowRequests: [],
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
      const created = await borrowRequestService.createBorrowRequest(payload);

      set((state) => ({
        borrowRequests: [created, ...state.borrowRequests],
      }));
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

  cancelMyBorrowRequest: async (id: string, decisionNote: string) => {
    console.log('🏪 [STORE] cancelMyBorrowRequest started for ID:', id);
    try {
      set({ loading: true, error: null });
      await borrowRequestService.cancelBorrowRequest(id, decisionNote);
      // Update status in-place — record stays visible in history with status 'cancelled'
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: 'cancelled' } : item
        ),
        selectedBorrowRequest:
          state.selectedBorrowRequest?._id === id
            ? { ...state.selectedBorrowRequest, status: 'cancelled' }
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

  fetchAllBorrowRequests: async () => {
    try {
      set({ loading: true, error: null });
      const data = await borrowRequestService.getAllBorrowRequests();
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

  approveBorrowRequest: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const updated = await borrowRequestService.approveBorrowRequest(id);
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? updated : item
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Không duyệt được borrow request",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  rejectBorrowRequest: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const updated = await borrowRequestService.rejectBorrowRequest(id);
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? updated : item
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Không từ chối được borrow request",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  handoverBorrowRequest: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const updated = await borrowRequestService.handoverBorrowRequest(id);
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? updated : item
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Không bàn giao được thiết bị",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  returnBorrowRequest: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const updated = await borrowRequestService.returnBorrowRequest(id);
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? updated : item
        ),
      }));
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Không hoàn trả được thiết bị",
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