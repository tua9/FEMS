export interface Task {
  /** 6-char display id derived from Mongo ObjectId */
  id: string;
  /** Real Mongo Report _id */
  reportId?: string;
  /** Business serial code from Report.code, e.g. RP... */
  code?: string;
  /** Report.type (used for the sublabel under report subject) */
  type?: string;
  /** Task title (equipment name or room name) */
  title?: string;
  /** Equipment category or type */
  category?: string;

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
  description: string;

  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  // Real DB status from Report.status
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'fixed' | 'cancelled';

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