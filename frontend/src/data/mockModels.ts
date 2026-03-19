/**
 * mockModels.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Định nghĩa TypeScript interfaces phản ánh đúng các Mongoose models ở backend.
 * Dùng chung cho toàn bộ frontend (student / lecturer / technician / admin).
 *
 * Backend models:
 *   User, Equipment, BorrowRequest, Report, Room, Building, Session
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── User ─────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'student' | 'lecturer' | 'technician';

export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Building ─────────────────────────────────────────────────────────────────

export type BuildingStatus = 'active' | 'inactive' | 'maintenance';

export interface Building {
  _id: string;
  name: string;
  status: BuildingStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Room ─────────────────────────────────────────────────────────────────────

export type RoomType = 'classroom' | 'lab' | 'office' | 'meeting' | 'other';
export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export interface Room {
  _id: string;
  name: string;
  type: RoomType;
  status: RoomStatus;
  building_id: string | null;   // ref: Building
  building?: Building;           // populated
  createdAt: string;
  updatedAt: string;
}

// ── Equipment ─────────────────────────────────────────────────────────────────

export type EquipmentStatus = 'good' | 'broken' | 'maintenance';
export type EquipmentCategory = string;

export interface Equipment {
  _id: string;
  name: string;
  category: EquipmentCategory;
  available: boolean;
  status: EquipmentStatus;
  room_id: string | null;    // ref: Room
  room?: Room;               // populated
  borrowed_by: string | null; // ref: User
  borrower?: User;            // populated
  code: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── BorrowRequest ────────────────────────────────────────────────────────────

export type BorrowRequestType = 'equipment' | 'infrastructure';
export type BorrowRequestStatus = 'pending' | 'approved' | 'rejected' | 'handed_over' | 'returned' | 'cancelled' | 'borrowing' | 'closed';

export interface BorrowRequest {
  _id: string;
  user_id: string;             // ref: User
  user?: User;                 // populated
  equipment_id: string | null; // ref: Equipment
  equipment?: Equipment;       // populated
  room_id: string | null;      // ref: Room
  room?: Room;                 // populated
  type: BorrowRequestType;
  status: BorrowRequestStatus;
  processed_by: string | null;  // ref: User
  processed_at?: string | null;
  processor?: User;            // populated
  borrow_date: string;
  return_date: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Report ───────────────────────────────────────────────────────────────────

export type ReportType = 'equipment' | 'infrastructure' | 'other';
export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface Report {
  _id: string;
  user_id: string | null;      // ref: User  (null = guest)
  user?: User;                 // populated
  equipment_id: string | null; // ref: Equipment
  equipment?: Equipment;       // populated
  room_id: string | null;      // ref: Room
  room?: Room;                 // populated
  type: ReportType;
  status: ReportStatus;
  processed_by: string | null;  // ref: User
  processed_at?: string | null;
  processor?: User;            // populated
  img: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
