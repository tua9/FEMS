import api from "@/lib/axios";
import type { Building, BuildingStatus } from "@/types/building";

export interface CreateBuildingPayload {
  name: string;
  status?: BuildingStatus;
}

export const buildingService = {
  getAll: async (): Promise<Building[]> => {
    const res = await api.get("/buildings");
    return res.data;
  },

  getById: async (id: string): Promise<Building> => {
    const res = await api.get(`/buildings/${id}`);
    return res.data;
  },

  create: async (payload: CreateBuildingPayload): Promise<Building> => {
    const res = await api.post("/buildings", payload);
    return res.data.building || res.data;
  },

  update: async (id: string, payload: Partial<CreateBuildingPayload>): Promise<Building> => {
    const res = await api.patch(`/buildings/${id}`, payload);
    return res.data.building || res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/buildings/${id}`);
    return res.data;
  },
};
