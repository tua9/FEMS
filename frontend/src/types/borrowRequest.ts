export type BorrowRequestStatus =
  | "Pending"
  | "Approved"
  | "HandedOver"
  | "Returned"
  | "Cancelled"
  | string;

export type BorrowRequestType = "equipment" | "room" | string;

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
  user_id?: string | BorrowRequestUser;
  equipment_id?: string | BorrowRequestEquipment | null;
  room_id?: string | BorrowRequestRoom | null;
  approved_by?: string | BorrowRequestUser | null;
  type: BorrowRequestType;
  status: BorrowRequestStatus;
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