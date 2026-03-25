import { create } from "zustand";
import { equipmentService } from "@/services/equipmentService";

export const useEquipmentStore = create((set) => ({
  equipments: [],
  inventoryData: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    try {
      set({ loading: true, error: null });
      const data = await equipmentService.getAll();
      const list = Array.isArray(data) ? data : data?.equipments ?? data?.data ?? [];
      set({ equipments: Array.isArray(list) ? list : [] });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch equipments" });
    } finally {
      set({ loading: false });
    }
  },

  fetchInventory: async (params) => {
    try {
      set({ loading: true, error: null });
      const data = await equipmentService.getInventory(params);
      set({ inventoryData: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot fetch inventory" });
    } finally {
      set({ loading: false });
    }
  },

  createEquipment: async (payload) => {
    try {
      set({ loading: true, error: null });
      const response = await equipmentService.create(payload);
      const newEquipment = response.equipment || response;
      set((state) => ({ equipments: [newEquipment, ...state.equipments] }));
      return response;
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot create equipment" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateEquipment: async (id, payload) => {
    try {
      set({ loading: true, error: null });
      const updated = await equipmentService.update(id, payload);
      set((state) => ({
        equipments: state.equipments.map((e) => (e._id === id ? updated : e)),
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot update equipment" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteEquipment: async (id) => {
    try {
      set({ loading: true, error: null });
      await equipmentService.delete(id);
      set((state) => ({
        equipments: state.equipments.filter((e) => e._id !== id),
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || "Cannot delete equipment" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
