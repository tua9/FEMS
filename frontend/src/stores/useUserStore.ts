import { create } from "zustand";
import type { User } from "@/types/user";
import { userService, type CreateUserPayload } from "@/services/userService";

type UserStore = {
  users: User[];
  loading: boolean;
  error: string | null;

  fetchAllUsers: () => Promise<void>;
  createUser: (payload: CreateUserPayload) => Promise<void>;
  updateUser: (id: string, payload: Partial<CreateUserPayload>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchAllUsers: async () => {
    try {
      set({ loading: true, error: null });
      const data = await userService.getAll();
      set({ users: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch users" });
    } finally {
      set({ loading: false });
    }
  },

  createUser: async (payload: CreateUserPayload) => {
    try {
      set({ loading: true, error: null });
      const newUser = await userService.create(payload);
      set((state) => ({ users: [newUser, ...state.users] }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot create user" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (id: string, payload: Partial<CreateUserPayload>) => {
    try {
      set({ loading: true, error: null });
      const updated = await userService.update(id, payload);
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? updated : u)),
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot update user" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await userService.delete(id);
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot delete user" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
