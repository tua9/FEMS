import { create } from "zustand";
import { roomService } from "@/services/roomService";

export const useRoomStore = create((set) => ({
  rooms: [],
  currentRoom: null,
  statusCenterData: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    try {
      set({ loading: true, error: null });
      const data = await roomService.getAll();
      const list = Array.isArray(data) ? data : data?.rooms ?? data?.data ?? [];
      set({ rooms: Array.isArray(list) ? list : [] });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch rooms" });
    } finally {
      set({ loading: false });
    }
  },

  fetchStatusCenter: async (params) => {
    try {
      set({ loading: true, error: null });
      const data = await roomService.getStatusCenter(params);
      set({ statusCenterData: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch room status center" });
    } finally {
      set({ loading: false });
    }
  },

  fetchById: async (id) => {
    try {
      set({ loading: true, error: null });
      const data = await roomService.getById(id);
      set({ currentRoom: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch room details" });
    } finally {
      set({ loading: false });
    }
  },

  fetchByBuildingId: async (buildingId) => {
    try {
      set({ loading: true, error: null });
      const data = await roomService.getByBuildingId(buildingId);
      set({ rooms: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch rooms by building" });
    } finally {
      set({ loading: false });
    }
  },

  createRoom: async (payload) => {
    try {
      set({ loading: true, error: null });
      const newRoom = await roomService.create(payload);
      set((state) => ({ rooms: [newRoom, ...state.rooms] }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot create room" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateRoom: async (id, payload) => {
    try {
      set({ loading: true, error: null });
      const updated = await roomService.update(id, payload);
      set((state) => ({
        rooms: state.rooms.map((r) => (r._id === id ? updated : r)),
        currentRoom: state.currentRoom?._id === id ? updated : state.currentRoom,
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot update room" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteRoom: async (id) => {
    try {
      set({ loading: true, error: null });
      await roomService.delete(id);
      set((state) => ({
        rooms: state.rooms.filter((r) => r._id !== id),
        currentRoom: state.currentRoom?._id === id ? null : state.currentRoom,
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot delete room" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
