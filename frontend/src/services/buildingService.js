import api from "@/lib/axios";
export const buildingService = {
 getAll: async ()=> {
 const res = await api.get("/buildings");
 return res.data;
 },

 getById: async (id)=> {
 const res = await api.get(`/buildings/${id}`);
 return res.data;
 },

 create: async (payload)=> {
 const res = await api.post("/buildings", payload);
 return res.data.building || res.data;
 },

 update: async (id, payload)=> {
 const res = await api.patch(`/buildings/${id}`, payload);
 return res.data.building || res.data;
 },

 delete: async (id)=> {
 const res = await api.delete(`/buildings/${id}`);
 return res.data;
 },
};
