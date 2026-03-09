export type NotifType = 'ticket' | 'assigned' | 'resolved' | 'alert' | 'handover';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;   // relative label
  read: boolean;
  icon: string;   // material-symbols name
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'ticket',
    title: 'New ticket assigned',
    body: 'REP-7810 · Central AC Unit #12 — Main Library L2',
    time: '2 min ago',
    read: false,
    icon: 'assignment',
  },
  {
    id: 'n2',
    type: 'alert',
    title: 'Urgent priority raised',
    body: 'REP-7912 · Smart Water Heater escalated to Urgent',
    time: '18 min ago',
    read: false,
    icon: 'warning',
  },
  {
    id: 'n3',
    type: 'assigned',
    title: 'Ticket re-assigned to you',
    body: 'REP-7901 · Dell Precision Tower — CS Lab 102',
    time: '1 hr ago',
    read: false,
    icon: 'person_add',
  },
  {
    id: 'n4',
    type: 'resolved',
    title: 'Ticket resolved',
    body: 'REP-7905 · Epson Laser Projector marked Completed',
    time: '3 hr ago',
    read: true,
    icon: 'check_circle',
  },
  {
    id: 'n5',
    type: 'handover',
    title: 'Handover pending approval',
    body: 'Handover #HO-042 is waiting for your sign-off',
    time: 'Yesterday',
    read: true,
    icon: 'swap_horiz',
  },
  {
    id: 'n6',
    type: 'resolved',
    title: 'Ticket resolved',
    body: 'REP-7803 · Network Switch — Server Room B',
    time: 'Yesterday',
    read: true,
    icon: 'check_circle',
  },
];
