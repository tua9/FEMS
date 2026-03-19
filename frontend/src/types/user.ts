export type UserRole = 'admin' | 'student' | 'lecturer' | 'technician';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  displayName: string;
  avatarUrl?: string;
  avatarId?: string;
  phone?: string;
  dob?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
