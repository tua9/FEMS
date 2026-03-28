import api from "@/lib/axios"; // baseURL đã cấu hình /api
export const equipmentService = {
 getAll: async ()=> {
 const res = await api.get("/equipments");
 return res.data;
 },

 getById: async (id)=> {
 const res = await api.get(`/equipments/${id}`);
 return res.data;
 },

 create: async (payload)=> {
 const res = await api.post("/equipments", payload);
 return res.data.equipment;
 },

 update: async (id, payload)=> {
 const res = await api.put(`/equipments/${id}`, payload);
 return res.data.equipment;
 },

 delete: async (id)=> {
 const res = await api.delete(`/equipments/${id}`);
 return res.data;
 },

 getByCode: async (code)=> {
 const res = await api.get(`/equipments/code/${code}`);
 return res.data;
 },

 getInventory: async (params)=> {
 const res = await api.get("/equipments/inventory", { params });
 return res.data;
 },
};
