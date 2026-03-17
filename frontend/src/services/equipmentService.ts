import api from "@/lib/axios"; // baseURL đã cấu hình /api
import type { Equipment, CreateEquipmentPayload } from "@/types/equipment";

export const equipmentService = {
  getAll: async (): Promise<Equipment[]> => {
    const res = await api.get("/equipments");
    return res.data;
  },

  getById: async (id: string): Promise<Equipment> => {
    const res = await api.get(`/equipments/${id}`);
    return res.data;
  },

  create: async (payload: CreateEquipmentPayload): Promise<Equipment> => {
    const res = await api.post("/equipments", payload);
    return res.data.equipment;
  },

  update: async (id: string, payload: CreateEquipmentPayload): Promise<Equipment> => {
    const res = await api.put(`/equipments/${id}`, payload);
    return res.data.equipment;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/equipments/${id}`);
    return res.data;
  },

  getByQrCode: async (qrCode: string): Promise<Equipment> => {
    const res = await api.get(`/equipments/qr/${qrCode}`);
    return res.data;
  },

  getInventory: async (params?: any): Promise<{
    items: Equipment[];
    pagination: {
      totalItems: number;
      currentPage: number;
      totalPages: number;
      limit: number;
    }
  }> => {
    const res = await api.get("/equipments/inventory", { params });
    return res.data;
  },
};