export type NotificationType = 'approval' | 'borrow' | 'return' | 'equipment' | 'report' | 'general';

export interface Notification {
  _id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  to?: string;
  state?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
