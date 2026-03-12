export type RoomType = 'classroom' | 'lab' | 'office' | 'meeting' | 'other';
export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export interface Room {
  _id: string;
  name: string;
  type: RoomType;
  status: RoomStatus;
  building_id?: {
    _id: string;
    name: string;
  } | string | null;
  createdAt?: string;
  updatedAt?: string;
}
