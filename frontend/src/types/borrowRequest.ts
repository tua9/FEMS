export type BorrowRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "handed_over"
  | "overdue"
  | "returned"
  | string;

export type BorrowRequestType = "equipment" | "infrastructure" | string;

export interface BorrowRequestUser {
  _id: string;
  username?: string;
  displayName?: string;
  email?: string;
}

export interface BorrowRequestEquipment {
  _id: string;
  name: string;
  category?: string;
}

export interface BorrowRequestRoom {
  _id: string;
  name: string;
  type?: string;
}

export interface BorrowRequest {
  _id: string;
  user_id: string | BorrowRequestUser;
  equipment_id?: string | BorrowRequestEquipment | null;
  room_id?: string | BorrowRequestRoom | null;
  type: BorrowRequestType;
  status: BorrowRequestStatus;
  approved_by?: string | BorrowRequestUser | null;
  borrow_date: string;
  return_date: string;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBorrowRequestPayload {
  equipment_id?: string;
  room_id?: string;
  type: BorrowRequestType;
  borrow_date: string;
  return_date: string;
  note?: string;
}