import api from "@/lib/axios";
import type {
  BorrowRequest,
  CreateBorrowRequestPayload,
} from "@/types/borrowRequest";

export type DirectAllocationPayload = {
  user_id: string;
  equipment_id: string;
  borrow_date: string;
  return_date: string;
  note?: string;
};

export const borrowRequestService = {
  async getMyBorrowRequests(): Promise<BorrowRequest[]> {
    const res = await api.get("/requests/me");
    return res.data;
  },

  async getBorrowRequestById(id: string): Promise<BorrowRequest> {
    const res = await api.get(`/requests/${id}`);
    return res.data;
  },

  async createBorrowRequest(
    payload: CreateBorrowRequestPayload
  ): Promise<BorrowRequest> {
    const res = await api.post("/requests", payload);
    return res.data;
  },

  async directAllocateEquipment(payload: DirectAllocationPayload): Promise<{ message: string; borrowRequest: BorrowRequest }> {
    const res = await api.post("/requests/direct-allocation", payload);
    return res.data;
  },

  async cancelBorrowRequest(id: string, decisionNote: string): Promise<{ message?: string }> {
    console.log('🚀 [FRONTEND SERVICE] cancelBorrowRequest ID:', id);
    console.log('🚀 [FRONTEND SERVICE] cancelBorrowRequest decisionNote:', decisionNote);
    const res = await api.patch(`/requests/${id}/cancel`, { decision_note: decisionNote });
    console.log('✅ [FRONTEND SERVICE] cancelBorrowRequest result:', res.data);
    return res.data;
  },

  async getAllBorrowRequests(): Promise<BorrowRequest[]> {
    const res = await api.get("/requests");
    return res.data;
  },

  async approveBorrowRequest(id: string): Promise<BorrowRequest> {
    const res = await api.patch(`/requests/${id}/approve`);
    return res.data;
  },

  async rejectBorrowRequest(id: string, decisionNote?: string): Promise<BorrowRequest> {
    const res = await api.patch(`/requests/${id}/reject`, { decision_note: decisionNote });
    return res.data;
  },

  async handoverBorrowRequest(id: string): Promise<BorrowRequest> {
    const res = await api.patch(`/requests/${id}/handover`);
    return res.data;
  },

  async returnBorrowRequest(id: string): Promise<BorrowRequest> {
    const res = await api.patch(`/requests/${id}/return`);
    return res.data;
  },

  async getPendingBorrowRequests(): Promise<BorrowRequest[]> {
    const res = await api.get("/requests/pending");
    return res.data;
  },

  async getApprovedByMe(): Promise<BorrowRequest[]> {
    const res = await api.get("/requests/approved-by-me");
    return res.data;
  },
  async remindBorrowRequest(id: string): Promise<{ message: string }> {
    const res = await api.post(`/requests/${id}/remind`);
    return res.data;
  },
};