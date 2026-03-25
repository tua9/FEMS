import api from "@/lib/axios";
export const reportService = {
 create: async (payload)=> {
 const res = await api.post("/tickets/report", payload);
 return res.data.report || res.data;
 },

 getPersonalHistory: async ()=> {
 const res = await api.get("/tickets/history");
 return res.data;
 },

 getAll: async ()=> {
 const res = await api.get("/tickets");
 return res.data;
 },

 updateStatus: async (id, status, technicianId)=> {
 const res = await api.patch(`/tickets/${id}/status`, { status, technicianId });
 return res.data.report || res.data;
 },

 cancelReport: async (id, decisionNote)=> {
 const res = await api.delete(`/tickets/history/${id}`, { data: { decision_note: decisionNote } });
 return res.data.report || res.data;
 },

 getById: async (id)=> {
 const res = await api.get(`/tickets/${id}`);
 return res.data;
 },

};
