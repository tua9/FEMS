import { create } from "zustand";
import type { Equipment, CreateEquipmentPayload } from "@/types/equipment";
import { equipmentService } from "@/services/equipmentService";

type EquipmentStore = {
  equipments: Equipment[];
  inventoryData: {
    items: Equipment[];
    pagination: {
      totalItems: number;
      currentPage: number;
      totalPages: number;
      limit: number;
    }
  } | null;
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchInventory: (params?: any) => Promise<void>;
  createEquipment: (payload: CreateEquipmentPayload) => Promise<any>;
  updateEquipment: (id: string, payload: CreateEquipmentPayload) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
};

export const useEquipmentStore = create<EquipmentStore>((set) => ({
  equipments: [],
  inventoryData: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    try {
      set({ loading: true, error: null });
      const data = await equipmentService.getAll();
      set({ equipments: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch equipments" });
    } finally {
      set({ loading: false });
    }
  },

  fetchInventory: async (params?: any) => {
    try {
      set({ loading: true, error: null });
      const data = await equipmentService.getInventory(params);
      set({ inventoryData: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch inventory" });
    } finally {
      set({ loading: false });
    }
  },

  createEquipment: async (payload: CreateEquipmentPayload) => {
    try {
      set({ loading: true, error: null });
      const response = await equipmentService.create(payload);
      const newEquipment = (response as any).equipment || response;
      set((state) => ({ equipments: [newEquipment, ...state.equipments] }));
      return response;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot create equipment" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateEquipment: async (id: string, payload: CreateEquipmentPayload) => {
    try {
      set({ loading: true, error: null });
      const updated = await equipmentService.update(id, payload);
      set((state) => ({
        equipments: state.equipments.map((e) => (e._id === id ? updated : e)),
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot update equipment" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteEquipment: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await equipmentService.delete(id);
      set((state) => ({
        equipments: state.equipments.filter((e) => e._id !== id),
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot delete equipment" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));