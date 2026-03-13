export type ReportType = 'equipment' | 'infrastructure' | 'other';
export type ReportStatus = 'pending' | 'approved' | 'rejected' | 'processing' | 'fixed';

export interface Report {
  _id: string;
  user_id?: {
    _id: string;
    username: string;
    displayName?: string;
    email?: string;
  } | string | null;
  equipment_id?: {
    _id: string;
    name: string;
    category?: string;
  } | string | null;
  room_id?: {
    _id: string;
    name: string;
    building_id?: {
      _id: string;
      name: string;
    } | string | null;
  } | string | null;
  type: ReportType;
  status: ReportStatus;
  approved_by?: {
    _id: string;
    username: string;
    displayName?: string;
  } | string | null;
  img?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReportPayload {
  equipment_id?: string | null;
  room_id?: string | null;
  type: ReportType;
  img?: string | null;
  description?: string | null;
}
