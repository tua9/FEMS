export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'Electrical' | 'Plumbing' | 'Maintenance' | 'Furniture' | 'Safety' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  location: {
    building: string;
    room: string;
    floor: string;
  };
  reportedBy: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  notes?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  urgent: number;
}

export interface UpdateTaskPayload {
  status?: Task['status'];
  notes?: string;
  images?: File[];
}