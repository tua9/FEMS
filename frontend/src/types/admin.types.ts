export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Lecturer' | 'Student' | 'Manager' | 'Technician' | 'Super Admin';
  status: 'Active' | 'Inactive' | 'Pending';
  avatar?: string;
  phone?: string;
  department?: string;
  assignedTasks?: number; // Current workload for technicians
}

export interface Asset {
  id: string;
  name: string;
  category: 'Laptop' | 'Photography' | 'Peripheral' | 'Tablet' | 'Network' | 'Electronics' | 'Other';
  location: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Broken' | 'Repairing' | 'Broken Screen' | 'Decommissioned';
  imageUrl?: string;
  lastInspection?: string;
  description?: string;
  issueDescription?: string;
  warranty?: string;
  purchaseDate?: string;
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
  status: 'Pending' | 'Approved' | 'In Progress' | 'Resolved' | 'Rejected';
  technicianId?: string;
  technicianName?: string;
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

export interface HealthStatus {
  healthy: number;
  available: number;
  maintenance: number;
  broken: number;
}

export interface TopBrokenItem {
  name: string;
  count: number;
  percentage: number;
}
