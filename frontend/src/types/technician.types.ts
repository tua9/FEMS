export interface Task {
  /** 6-char display id derived from Mongo ObjectId */
  id: string;

  /** Equipment name (from Report.equipment_id.name) */
  equipment: string;

  /** Location string components (from Room + Building refs) */
  location: {
    building: string;
    room: string;
    floor: string;
  };

  /** Issue description (from Report.description) */
  issue: string;

  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

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
  /** Tickets approved to be fixed (mapped from Report.status='approved') */
  approved?: number;
  inProgress: number;
  completed: number;
  urgent: number;
}

export interface UpdateTaskPayload {
  status?: Task['status'];
  notes?: string;
  images?: File[];
}