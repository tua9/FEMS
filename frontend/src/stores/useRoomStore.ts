import { create } from "zustand";
import type { Room } from "@/types/room";
import { roomService, CreateRoomPayload } from "@/services/roomService";

type RoomStore = {
  rooms: Room[];
  currentRoom: Room | null;
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  createRoom: (payload: CreateRoomPayload) => Promise<void>;
  updateRoom: (id: string, payload: Partial<CreateRoomPayload>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
};

export const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    try {
      set({ loading: true, error: null });
      const data = await roomService.getAll();
      set({ rooms: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch rooms" });
    } finally {
      set({ loading: false });
    }
  },

  fetchById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const data = await roomService.getById(id);
      set({ currentRoom: data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot fetch room details" });
    } finally {
      set({ loading: false });
    }
  },

  createRoom: async (payload: CreateRoomPayload) => {
    try {
      set({ loading: true, error: null });
      const newRoom = await roomService.create(payload);
      set((state) => ({ rooms: [newRoom, ...state.rooms] }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot create room" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateRoom: async (id: string, payload: Partial<CreateRoomPayload>) => {
    try {
      set({ loading: true, error: null });
      const updated = await roomService.update(id, payload);
      set((state) => ({
        rooms: state.rooms.map((r) => (r._id === id ? updated : r)),
        currentRoom: state.currentRoom?._id === id ? updated : state.currentRoom,
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot update room" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteRoom: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await roomService.delete(id);
      set((state) => ({
        rooms: state.rooms.filter((r) => r._id !== id),
        currentRoom: state.currentRoom?._id === id ? null : state.currentRoom,
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "Cannot delete room" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
