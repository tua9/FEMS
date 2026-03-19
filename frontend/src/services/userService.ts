import api from "@/lib/axios";
import type { User, UserRole } from "@/types/user";

export interface CreateUserPayload {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  displayName?: string;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/admin/users");
    return res.data;
  },

  getById: async (id: string): Promise<User> => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const res = await api.post("/admin/users", payload);
    return res.data.user || res.data;
  },

  update: async (id: string, payload: Partial<CreateUserPayload>): Promise<User> => {
    const res = await api.patch(`/admin/users/${id}`, payload);
    return res.data.user || res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
};
