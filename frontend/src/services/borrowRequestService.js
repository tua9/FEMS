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

 async createBorrowRequest(
 payload) {
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

 async approveBorrowRequest(id) {
 const res = await api.patch(`/requests/${id}/approve`);
 return res.data;
 },

 async rejectBorrowRequest(id, decisionNote) {
 const res = await api.patch(`/requests/${id}/reject`, { decisionNote });
 return res.data;
 },

 async handoverBorrowRequest(id) {
 const res = await api.patch(`/requests/${id}/handover`);
 return res.data;
 },

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
