import { create } from "zustand";
import { userService } from "@/services/userService";

export const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchAllUsers: async () => {
    try {
      set({ loading: true, error: null });
      const data = await userService.getAll();
      set({ users: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch users" });
    } finally {
      set({ loading: false });
    }
  },

  createUser: async (payload) => {
    try {
      set({ loading: true, error: null });
      const newUser = await userService.create(payload);
      set((state) => ({ users: [newUser, ...state.users] }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot create user" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (id, payload) => {
    try {
      set({ loading: true, error: null });
      const updated = await userService.update(id, payload);
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? updated : u)),
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot update user" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (id) => {
    try {
      set({ loading: true, error: null });
      await userService.delete(id);
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot delete user" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
