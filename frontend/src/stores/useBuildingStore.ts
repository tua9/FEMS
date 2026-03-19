import { create } from "zustand";
import type { Building } from "@/types/building";
import { buildingService, type CreateBuildingPayload } from "@/services/buildingService";

type BuildingStore = {
  buildings: Building[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  createBuilding: (payload: CreateBuildingPayload) => Promise<void>;
  updateBuilding: (id: string, payload: Partial<CreateBuildingPayload>) => Promise<void>;
  deleteBuilding: (id: string) => Promise<void>;
};

export const useBuildingStore = create<BuildingStore>((set) => ({
  buildings: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    try {
      set({ loading: true, error: null });
      const data = await buildingService.getAll();
      set({ buildings: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch buildings" });
    } finally {
      set({ loading: false });
    }
  },

  createBuilding: async (payload: CreateBuildingPayload) => {
    try {
      set({ loading: true, error: null });
      const newBuilding = await buildingService.create(payload);
      set((state) => ({ buildings: [newBuilding, ...state.buildings] }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot create building" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateBuilding: async (id: string, payload: Partial<CreateBuildingPayload>) => {
    try {
      set({ loading: true, error: null });
      const updated = await buildingService.update(id, payload);
      set((state) => ({
        buildings: state.buildings.map((b) => (b._id === id ? updated : b)),
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot update building" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteBuilding: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await buildingService.delete(id);
      set((state) => ({
        buildings: state.buildings.filter((b) => b._id !== id),
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot delete building" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
