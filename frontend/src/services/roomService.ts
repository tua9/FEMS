import api from "@/lib/axios";
import type { Room, RoomStatus, RoomType, BuildingGroup } from "@/types/room";

export interface CreateRoomPayload {
  name: string;
  type?: RoomType;
  status?: RoomStatus;
  building_id?: string | null;
}

export const roomService = {
  getAll: async (): Promise<Room[]> => {
    const res = await api.get("/rooms");
    return res.data;
  },

  getById: async (id: string): Promise<Room> => {
    const res = await api.get(`/rooms/${id}`);
    return res.data;
  },

  getStatusCenter: async (params?: any): Promise<BuildingGroup[]> => {
    const res = await api.get("/rooms/status-center", { params });
    return res.data;
  },

  create: async (payload: CreateRoomPayload): Promise<Room> => {
    const res = await api.post("/rooms", payload);
    return res.data.room || res.data;
  },

  update: async (id: string, payload: Partial<CreateRoomPayload>): Promise<Room> => {
    const res = await api.patch(`/rooms/${id}`, payload);
    return res.data.room || res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/rooms/${id}`);
    return res.data;
  },
};
