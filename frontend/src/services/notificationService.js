import api from "@/lib/axios";
export const notificationService = {
 async getNotifications() {
 const res = await api.get("/notifications");
 return res.data;
 },

 async markAsRead(id) {
 const res = await api.patch(`/notifications/${id}/read`);
 return res.data;
 },

 async markAllAsRead() {
 const res = await api.patch("/notifications/mark-all-read");
 return res.data;
 },

 async deleteNotification(id) {
 const res = await api.delete(`/notifications/${id}`);
 return res.data;
 },

 async clearAll() {
 const res = await api.delete("/notifications/clear-all");
 return res.data;
 },
 
 async broadcast(data) {
 const res = await api.post("/notifications/broadcast", data);
 return res.data;
 },
};
