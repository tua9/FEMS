export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Lecturer' | 'Student' | 'Manager' | 'Technician' | 'Super Admin';
  status: 'Active' | 'Inactive' | 'Pending';
  avatar?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: 'Laptop' | 'Photography' | 'Peripheral' | 'Tablet' | 'Network' | 'Other';
  location: string;
  quantity: number;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Broken' | 'Repairing' | 'Broken Screen';
  imageUrl?: string;
  lastInspection?: string;
  description?: string;
}

export interface EquipmentRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  equipmentName: string;
  department: string;
  timeRequested: string; // ISO string or relative time string for mock
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface DamageReport {
  id: string;
  equipmentId: string;
  equipmentName: string;
  issueDescription: string;
  reportedBy: string;
  reporterAvatar?: string;
  dateReported: string; // YYYY-MM-DD
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface BorrowRecord {
  id: string;
  borrowerId: string;
  borrowerName: string;
  borrowerAvatar?: string;
  equipmentId: string;
  equipmentName: string;
  dueDate: string; // YYYY-MM-DD
  status: 'Pending' | 'Approved' | 'Overdue' | 'Returned' | 'Rejected';
  isDueTodayOrTomorrow?: boolean;
}

export interface DashboardMetrics {
  totalDevices: number;
  devicesTrend: number; // e.g. +12
  brokenDevices: number;
  criticalRepairs: number;
  pendingRequests: number;
  avgResponseTimeHours: number;
  efficiencyRate: number;
}
