/**
 * Type definitions for notifications feature
 */

export type IconColor = 'emerald' | 'amber' | 'blue' | 'red';

export interface Notification {
  id: string;
  title: string;
  message: string;
  icon: string;
  iconColor: IconColor;
  timestamp: string;
  isUnread: boolean;
}

export interface NotificationGroup {
  section: string; // 'Today', 'Yesterday', 'Earlier'
  notifications: Notification[];
}
