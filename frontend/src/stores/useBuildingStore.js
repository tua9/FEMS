import { create } from "zustand";
import { buildingService } from "@/services/buildingService";

export const useBuildingStore = create((set) => ({
  buildings: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    try {
      set({ loading: true, error: null });
      const data = await buildingService.getAll();
      set({ buildings: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch buildings" });
    } finally {
      set({ loading: false });
    }
  },

  createBuilding: async (payload) => {
    try {
      set({ loading: true, error: null });
      const newBuilding = await buildingService.create(payload);
      set((state) => ({ buildings: [newBuilding, ...state.buildings] }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot create building" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateBuilding: async (id, payload) => {
    try {
      set({ loading: true, error: null });
      const updated = await buildingService.update(id, payload);
      set((state) => ({
        buildings: state.buildings.map((b) => (b._id === id ? updated : b)),
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot update building" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteBuilding: async (id) => {
    try {
      set({ loading: true, error: null });
      await buildingService.delete(id);
      set((state) => ({
        buildings: state.buildings.filter((b) => b._id !== id),
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot delete building" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
