import api from "@/lib/axios";

export const borrowRequestService = {
  async getMyBorrowRequests() {
    const res = await api.get("/requests/me");
    return res.data;
  },

  async getBorrowRequestById(id) {
    const res = await api.get(`/requests/${id}`);
    return res.data;
  },

  async createBorrowRequest(payload) {
    const res = await api.post("/requests", payload);
    return res.data;
  },

  async directAllocateEquipment(payload) {
    const res = await api.post("/requests/direct-allocation", payload);
    return res.data;
  },

  async cancelBorrowRequest(id, decisionNote) {
    const res = await api.patch(`/requests/${id}/cancel`, { decisionNote });
    return res.data;
  },

  async getAllBorrowRequests() {
    const res = await api.get("/requests");
    return res.data;
  },

  async approveBorrowRequest(id, decisionNote) {
    const res = await api.patch(`/requests/${id}/approve`, decisionNote ? { decisionNote } : {});
    return res.data;
  },

  async rejectBorrowRequest(id, decisionNote) {
    const res = await api.patch(`/requests/${id}/reject`, { decisionNote });
    return res.data;
  },

  /**
   * Student confirms receipt of equipment.
   * Transitions: approved → handed_over
   */
  async confirmReceived(id, formData) {
    const res = await api.patch(`/requests/${id}/confirm-received`, formData);
    return res.data;
  },

  /**
   * Student submits return request.
   */
  async submitReturn(id, formData) {
    const res = await api.patch(`/requests/${id}/submit-return`, formData);
    return res.data;
  },

  /**
   * Lecturer/Admin confirms return after inspecting equipment.
   * Transitions: returning → returned
   */
  async returnBorrowRequest(id, formData) {
    const res = await api.patch(`/requests/${id}/return`, formData);
    return res.data;
  },

  async getPendingBorrowRequests() {
    const res = await api.get("/requests/pending");
    return res.data;
  },

  async getApprovedByMe() {
    const res = await api.get("/requests/approved-by-me");
    return res.data;
  },

  async remindBorrowRequest(id, note) {
    const res = await api.post(`/requests/${id}/remind`, { note });
    return res.data;
  },
};
