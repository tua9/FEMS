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
  } | string | null;
  borrowed_by?: {
    _id: string;
    username: string;
    displayName: string;
    email: string;
  } | string | null;
  code?: string | null;
  imageUrl?: string;
  description?: string;
  issueDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEquipmentPayload {
  name: string;
  category: string;
  status?: EquipmentStatus;
  room_id?: string | null;
  code?: string | null;
}