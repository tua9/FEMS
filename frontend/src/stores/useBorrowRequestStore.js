import { create } from "zustand";
import { borrowRequestService } from "@/services/borrowRequestService";

export const useBorrowRequestStore = create((set, get) => ({
  borrowRequests: [],
  pendingBorrowRequests: [],
  approvedByMe: [],
  selectedBorrowRequest: null,
  loading: false,
  actionLoading: null,
  error: null,

  fetchMyBorrowRequests: async () => {
    if (get().loading) return;
    try {
      set({ loading: true, error: null });
      const data = await borrowRequestService.getMyBorrowRequests();
      set({ borrowRequests: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Không tải được danh sách borrow request" });
    } finally {
      set({ loading: false });
    }
  },

  fetchApprovedByMe: async () => {
    if (get().loading) return;
    try {
      set({ loading: true, error: null });
      const data = await borrowRequestService.getApprovedByMe();
      set({ approvedByMe: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Không tải được lịch sử phê duyệt" });
    } finally {
      set({ loading: false });
    }
  },

  fetchPendingBorrowRequests: async () => {
    try {
      set({ loading: true, error: null });
      const data = await borrowRequestService.getPendingBorrowRequests();
      set({ pendingBorrowRequests: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Không tải được danh sách yêu cầu chờ duyệt" });
    } finally {
      set({ loading: false });
    }
  },

  fetchBorrowRequestById: async (id) => {
    try {
      set({ loading: true, error: null });
      const data = await borrowRequestService.getBorrowRequestById(id);
      set({ selectedBorrowRequest: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Không tải được chi tiết borrow request" });
    } finally {
      set({ loading: false });
    }
  },

  createMyBorrowRequest: async (payload) => {
    try {
      set({ loading: true, error: null });
      await borrowRequestService.createBorrowRequest(payload);
    } catch (error) {
      set({ error: error?.response?.data?.message || "Không tạo được borrow request" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  cancelMyBorrowRequest: async (id, decisionNote) => {
    try {
      set({ loading: true, error: null });
      await borrowRequestService.cancelBorrowRequest(id, decisionNote);
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: "cancelled" } : item
        ),
        selectedBorrowRequest:
          state.selectedBorrowRequest?._id === id
            ? { ...state.selectedBorrowRequest, status: "cancelled" }
            : state.selectedBorrowRequest,
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Không hủy được borrow request" });
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
    } catch (error) {
      set({ error: error?.response?.data?.message || "Không tải được danh sách borrow request" });
    } finally {
      set({ loading: false });
    }
  },

  approveBorrowRequest: async (id) => {
    set((state) => ({
      borrowRequests: state.borrowRequests.map((item) =>
        item._id === id ? { ...item, status: "approved" } : item
      ),
      pendingBorrowRequests: state.pendingBorrowRequests.filter((item) => item._id !== id),
    }));
    try {
      set({ actionLoading: id, error: null });
      const updated = await borrowRequestService.approveBorrowRequest(id);
      if (updated && updated._id) {
        set((state) => ({
          borrowRequests: state.borrowRequests.map((item) =>
            item._id === id ? updated : item
          ),
        }));
      }
      const freshHistory = await borrowRequestService.getApprovedByMe();
      set({ approvedByMe: freshHistory });
    } catch (error) {
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: "pending" } : item
        ),
        error: error?.response?.data?.message || "Không duyệt được borrow request",
      }));
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },

  rejectBorrowRequest: async (id, decisionNote) => {
    set((state) => ({
      borrowRequests: state.borrowRequests.map((item) =>
        item._id === id ? { ...item, status: "rejected" } : item
      ),
      pendingBorrowRequests: state.pendingBorrowRequests.filter((item) => item._id !== id),
    }));
    try {
      set({ actionLoading: id, error: null });
      const updated = await borrowRequestService.rejectBorrowRequest(id, decisionNote);
      if (updated && updated._id) {
        set((state) => ({
          borrowRequests: state.borrowRequests.map((item) =>
            item._id === id ? updated : item
          ),
        }));
      }
      const freshHistory = await borrowRequestService.getApprovedByMe();
      set({ approvedByMe: freshHistory });
    } catch (error) {
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: "pending" } : item
        ),
        error: error?.response?.data?.message || "Không từ chối được borrow request",
      }));
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },

  /**
   * Lecturer submits handover form.
   * formData: { checklist, notes, images }
   */
  submitHandoverForm: async (id, formData) => {
    try {
      set({ actionLoading: id, error: null });
      const result = await borrowRequestService.submitHandoverForm(id, formData);
      const updated = result?.request || result;
      if (updated && updated._id) {
        set((state) => ({
          borrowRequests: state.borrowRequests.map((item) =>
            item._id === id ? updated : item
          ),
        }));
      }
      return updated;
    } catch (error) {
      set({ error: error?.response?.data?.message || "Không gửi được form bàn giao" });
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },

  /**
   * Student confirms received.
   * Optimistic: approved → handed_over
   */
  confirmReceived: async (id) => {
    set((state) => ({
      borrowRequests: state.borrowRequests.map((item) =>
        item._id === id ? { ...item, status: "handed_over" } : item
      ),
    }));
    try {
      set({ actionLoading: id, error: null });
      const result = await borrowRequestService.confirmReceived(id);
      const updated = result?.request || result;
      if (updated && updated._id) {
        set((state) => ({
          borrowRequests: state.borrowRequests.map((item) =>
            item._id === id ? updated : item
          ),
        }));
      }
    } catch (error) {
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: "approved" } : item
        ),
        error: error?.response?.data?.message || "Không xác nhận được nhận thiết bị",
      }));
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },

  /**
   * Student submits return form.
   * formData: { checklist, notes, images }
   * Optimistic: handed_over → returning
   */
  submitReturn: async (id, formData) => {
    set((state) => ({
      borrowRequests: state.borrowRequests.map((item) =>
        item._id === id ? { ...item, status: "returning" } : item
      ),
    }));
    try {
      set({ actionLoading: id, error: null });
      const result = await borrowRequestService.submitReturn(id, formData);
      const updated = result?.request || result;
      if (updated && updated._id) {
        set((state) => ({
          borrowRequests: state.borrowRequests.map((item) =>
            item._id === id ? updated : item
          ),
        }));
      }
    } catch (error) {
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: "handed_over" } : item
        ),
        error: error?.response?.data?.message || "Không gửi được yêu cầu trả thiết bị",
      }));
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },

  /**
   * Lecturer confirms return.
   * Optimistic: returning → returned
   */
  returnBorrowRequest: async (id) => {
    set((state) => ({
      borrowRequests: state.borrowRequests.map((item) =>
        item._id === id ? { ...item, status: "returned" } : item
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
    } catch (error) {
      set((state) => ({
        borrowRequests: state.borrowRequests.map((item) =>
          item._id === id ? { ...item, status: "returning" } : item
        ),
        error: error?.response?.data?.message || "Không xác nhận được thiết bị đã trả",
      }));
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },

  remindBorrowRequest: async (id) => {
    try {
      set({ actionLoading: id, error: null });
      await borrowRequestService.remindBorrowRequest(id);
    } catch (error) {
      set({ error: error?.response?.data?.message || "Không gửi được lời nhắc" });
      throw error;
    } finally {
      set({ actionLoading: null });
    }
  },

  clearBorrowRequests: () => {
    set({ borrowRequests: [], error: null });
  },

  clearSelectedBorrowRequest: () => {
    set({ selectedBorrowRequest: null });
  },
}));
