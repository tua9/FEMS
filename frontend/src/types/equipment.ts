export type EquipmentStatus = 'good' | 'broken' | 'maintenance' | string;

export interface Equipment {
  _id: string;
  name: string;
  category: string;
  available: boolean;
  status: EquipmentStatus;
  room_id?: {
    _id: string;
    name: string;
  } | null;
  borrowed_by?: string | null;
  qr_code?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEquipmentPayload {
  name: string;
  category: string;
  status?: EquipmentStatus;
  room_id?: string | null;
}