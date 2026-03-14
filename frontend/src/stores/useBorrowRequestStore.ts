import { create } from "zustand";
import { borrowRequestService } from "@/services/borrowRequestService";
import type {
  BorrowRequest,
  CreateBorrowRequestPayload,
} from "@/types/borrowRequest";

type BorrowRequestStore = {
  borrowRequests: BorrowRequest[];
  selectedBorrowRequest: BorrowRequest | null;
  loading: boolean;       // fetch toàn bộ danh sách
  actionLoading: string | null; // ID của record đang xử lý action
  error: string | null;

  fetchMyBorrowRequests: () => Promise<void>;
  fetchBorrowRequestById: (id: string) => Promise<void>;
  createMyBorrowRequest: (payload: CreateBorrowRequestPayload) => Promise<void>;
  cancelMyBorrowRequest: (id: string) => Promise<void>;
  fetchAllBorrowRequests: () => Promise<void>;
  approveBorrowRequest: (id: string) => Promise<void>;
  rejectBorrowRequest: (id: string) => Promise<void>;
  handoverBorrowRequest: (id: string) => Promise<void>;
  returnBorrowRequest: (id: string) => Promise<void>;
  remindBorrowRequest: (id: string) => Promise<void>;
  clearBorrowRequests: () => void;
  clearSelectedBorrowRequest: () => void;
};

export const useBorrowRequestStore = create<BorrowRequestStore>((set) => ({
  borrowRequests: [],
  selectedBorrowRequest: null,
  loading: false,
  actionLoading: null,
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
    // Optimistic update: cập nhật status ngay lập tức trước khi chờ API
    set((state) => ({
      borrowRequests: state.borrowRequests.map((item) =>
        item._id === id ? { ...item, status: 'approved' } : item
      ),
    }));
    try {
      set({ actionLoading: id, error: null });
      const updated = await borrowRequestService.approveBorrowRequest(id);
      // Nếu API trả về đúng BorrowRequest thì sync lại với data thực tế từ server
      if (updated && updated._id) {
        set((state) => ({
          borrowRequests: state.borrowRequests.map((item) =>
            item._id === id ? updated : item
          ),
        }));
      }
    } catch (error: any) {
      // Rollback nếu lỗi
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: 'pending' } : item
        ),
        error: error?.response?.data?.message || "Không duyệt được borrow request",
      }));
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },

  rejectBorrowRequest: async (id: string) => {
    set((state) => ({
      borrowRequests: state.borrowRequests.map((item) =>
        item._id === id ? { ...item, status: 'rejected' } : item
      ),
    }));
    try {
      set({ actionLoading: id, error: null });
      const updated = await borrowRequestService.rejectBorrowRequest(id);
      if (updated && updated._id) {
        set((state) => ({
          borrowRequests: state.borrowRequests.map((item) =>
            item._id === id ? updated : item
          ),
        }));
      }
    } catch (error: any) {
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: 'pending' } : item
        ),
        error: error?.response?.data?.message || "Không từ chối được borrow request",
      }));
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },

  handoverBorrowRequest: async (id: string) => {
    set((state) => ({
      borrowRequests: state.borrowRequests.map((item) =>
        item._id === id ? { ...item, status: 'handed_over' } : item
      ),
    }));
    try {
      set({ actionLoading: id, error: null });
      const updated = await borrowRequestService.handoverBorrowRequest(id);
      if (updated && updated._id) {
        set((state) => ({
          borrowRequests: state.borrowRequests.map((item) =>
            item._id === id ? updated : item
          ),
        }));
      }
    } catch (error: any) {
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: 'approved' } : item
        ),
        error: error?.response?.data?.message || "Không bàn giao được thiết bị",
      }));
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },

  returnBorrowRequest: async (id: string) => {
    set((state) => ({
      borrowRequests: state.borrowRequests.map((item) =>
        item._id === id ? { ...item, status: 'returned' } : item
      ),
    }));
    try {
      set({ actionLoading: id, error: null });
      const updated = await borrowRequestService.returnBorrowRequest(id);
      if (updated && updated._id) {
        set((state) => ({
          borrowRequests: state.borrowRequests.map((item) =>
            item._id === id ? updated : item
          ),
        }));
      }
    } catch (error: any) {
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: 'handed_over' } : item
        ),
        error: error?.response?.data?.message || "Không hoàn trả được thiết bị",
      }));
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },
  remindBorrowRequest: async (id: string) => {
    try {
      set({ actionLoading: id, error: null });
      await borrowRequestService.remindBorrowRequest(id);
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Không gửi được lời nhắc",
      });
      throw error;
    } finally {
      set({ actionLoading: null });
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