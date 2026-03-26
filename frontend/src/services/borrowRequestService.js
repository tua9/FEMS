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
   * Lecturer submits handover form.
   * @param {string} id
   * @param {{ checklist: {appearance, functioning, accessories}, notes: string, images: string[] }} formData
   */
  async submitHandoverForm(id, formData) {
    const res = await api.patch(`/requests/${id}/handover`, formData);
    return res.data;
  },

  async handoverBorrowRequest(id, formData) {
    return this.submitHandoverForm(id, formData);
  },

  /**
   * Student confirms receipt of equipment.
   * Transitions: approved (with handoverInfo) → handed_over
   */
  async confirmReceived(id) {
    const res = await api.patch(`/requests/${id}/confirm-received`);
    return res.data;
  },

  /**
   * Student submits return form.
   * @param {string} id
   * @param {{ checklist: {appearance, functioning, accessories}, notes: string, images: string[] }} formData
   */
  async submitReturn(id, formData) {
    const res = await api.patch(`/requests/${id}/submit-return`, formData);
    return res.data;
  },

  /**
   * Lecturer/Admin confirms return after inspecting equipment.
   * Transitions: returning → returned
   */
  async returnBorrowRequest(id) {
    const res = await api.patch(`/requests/${id}/return`);
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

  async remindBorrowRequest(id) {
    const res = await api.post(`/requests/${id}/remind`);
    return res.data;
  },
};
