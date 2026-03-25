import api from "@/lib/axios";
export const roomService = {
 getAll: async ()=> {
 const res = await api.get("/rooms");
 return res.data;
 },

 getById: async (id)=> {
 const res = await api.get(`/rooms/${id}`);
 return res.data;
 },

 getStatusCenter: async (params)=> {
 const res = await api.get("/rooms/status-center", { params });
 return res.data;
 },

 getByBuildingId: async (buildingId)=> {
 const res = await api.get(`/rooms/building/${buildingId}`);
 return res.data;
 },

 create: async (payload)=> {
 const res = await api.post("/rooms", payload);
 return res.data.room || res.data;
 },

 update: async (id, payload)=> {
 const res = await api.patch(`/rooms/${id}`, payload);
 return res.data.room || res.data;
 },

 delete: async (id)=> {
 const res = await api.delete(`/rooms/${id}`);
 return res.data;
 },
};
