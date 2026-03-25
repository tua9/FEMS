import api from "@/lib/axios";
export const adminService = {
 getDashboardStats: async ()=> {
 const res = await api.get("/admin/dashboard/stats");
 return res.data;
 },

 getDashboardChart: async ()=> {
 const res = await api.get("/admin/dashboard/chart");
 return res.data;
 },
 getHealthStatus: async ()=> {
 const res = await api.get("/admin/dashboard/health");
 return res.data;
 },
 getRecentBorrowRequests: async ()=> {
 const res = await api.get("/admin/dashboard/borrow-requests");
 return res.data;
 },
 getRecentDamageReports: async ()=> {
 const res = await api.get("/admin/dashboard/damage-reports");
 return res.data;
 },

 getEquipmentAnalytics: async ()=> {
 const res = await api.get("/admin/dashboard/equipment-analytics");
 return res.data;
 },

 getReportAnalytics: async ()=> {
 const res = await api.get("/admin/dashboard/report-analytics");
 return res.data;
 },
};
