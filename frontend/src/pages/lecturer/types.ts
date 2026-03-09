
export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  RETURNED = 'RETURNED',
  BORROWED = 'BORROWED',
  OVERDUE = 'OVERDUE'
}

export interface Activity {
  id: string;
  type: 'access' | 'return' | 'report';
  title: string;
  subject: string;
  time: string;
  description?: string;
}

export interface ClassSession {
  id: string;
  timeRange: string;
  title: string;
  location: string;
  status: 'active' | 'upcoming' | 'completed';
}

export interface EquipmentItem {
  id: string;
  assetId: string;
  name: string;
  category: 'laptop' | 'projector' | 'tablet' | 'monitor' | 'camera' | 'audio';
  location: string;
  status: 'AVAILABLE' | 'IN USE' | 'MAINTENANCE';
}

export interface BorrowRequest {
  id: string;
  studentName: string;
  studentId: string;
  studentAvatar: string;
  equipmentName: string;
  assetId: string;
  period: string;
  category: string;
  status: RequestStatus;
}
