export type BuildingStatus = 'active' | 'inactive' | 'maintenance';

export interface Building {
  _id: string;
  name: string;
  status: BuildingStatus;
  createdAt?: string;
  updatedAt?: string;
}
