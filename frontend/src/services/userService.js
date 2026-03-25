import api from "@/lib/axios";
export const userService = {
 getAll: async ()=> {
 const res = await api.get("/admin/users");
 return res.data;
 },

 getById: async (id)=> {
 const res = await api.get(`/admin/users/${id}`);
 return res.data;
 },

 create: async (payload)=> {
 const res = await api.post("/admin/users", payload);
 return res.data.user || res.data;
 },

 update: async (id, payload)=> {
 const res = await api.patch(`/admin/users/${id}`, payload);
 return res.data.user || res.data;
 },

 delete: async (id)=> {
 const res = await api.delete(`/admin/users/${id}`);
 return res.data;
 },
};
