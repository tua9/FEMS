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

export interface RoomDevice {
  name: string;
  status: 'ACTIVE' | 'FAULTY' | 'MAINTENANCE';
}

export interface RoomStatusCenterItem {
  _id: string;
  name: string;
  type: RoomType;
  status: RoomStatus;
  floor: number;
  labels: string[];
  operationalSummary: string;
  displayDevices: RoomDevice[];
  totalDevices: number;
  faultyDevices: number;
}

export interface BuildingGroup {
  _id: string;
  buildingName: string;
  rooms: RoomStatusCenterItem[];
}
