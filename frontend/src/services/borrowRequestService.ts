import api from "@/lib/axios";
import type {
  BorrowRequest,
  CreateBorrowRequestPayload,
} from "@/types/borrowRequest";

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

  async cancelBorrowRequest(id: string): Promise<{ message?: string }> {
    const res = await api.delete(`/requests/${id}`);
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

  async handoverBorrowRequest(id: string): Promise<BorrowRequest> {
    const res = await api.patch(`/requests/${id}/handover`);
    return res.data;
  },

  async returnBorrowRequest(id: string): Promise<BorrowRequest> {
    const res = await api.patch(`/requests/${id}/return`);
    return res.data;
  },

  async rejectBorrowRequest(id: string): Promise<BorrowRequest> {
    const res = await api.patch(`/requests/${id}/reject`);
    return res.data;
  },
};