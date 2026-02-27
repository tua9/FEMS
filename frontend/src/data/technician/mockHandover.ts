// ─── Handover Management — mock data ────────────────────────────────────────

// ── Tab type ─────────────────────────────────────────────────────────────────
export type HandoverTab = 'Requests' | 'Handover' | 'Collect' | 'History';

// ── Borrow Requests (tab: Requests) ──────────────────────────────────────────
export interface BorrowRequest {
  id: string;            // e.g. #REQ-2024-089
  borrower: {
    name: string;
    userId: string;
    avatar?: string;
  };
  equipment: { name: string; location: string };
  duration: string;      // e.g. "3 Days"
  purpose: string;
}

export const MOCK_BORROW_REQUESTS: BorrowRequest[] = [
  {
    id: '#REQ-2024-089',
    borrower: { name: 'Prof. Sarah Jenkins', userId: '102938' },
    equipment: { name: 'iPad Pro + Apple Pencil', location: 'Art Dept Inventory' },
    duration: '3 Days',
    purpose: 'Digital Illustration Workshop for Year 2 Students',
  },
  {
    id: '#REQ-2024-092',
    borrower: { name: 'James Wilson', userId: 'STU-4402' },
    equipment: { name: 'Canon EOS R6 Kit', location: 'Media Lab' },
    duration: '24 Hours',
    purpose: 'Outdoor Photography Assignment',
  },
  {
    id: '#REQ-2024-095',
    borrower: { name: 'Dr. Elena Rodriguez', userId: '559021' },
    equipment: { name: 'Dell Precision Workstation', location: 'Engineering Tower' },
    duration: '14 Days',
    purpose: 'High-performance computing for research project',
  },
  {
    id: '#REQ-2024-101',
    borrower: { name: 'Mark Thompson', userId: 'STU-8821' },
    equipment: { name: 'Oculus Rift S + Controllers', location: 'VR Lab' },
    duration: '2 Days',
    purpose: 'Interaction design prototype testing',
  },
  {
    id: '#REQ-2024-105',
    borrower: { name: 'Dr. Alan Park', userId: '881102' },
    equipment: { name: 'Sony A7 IV Camera', location: 'Media Lab' },
    duration: '7 Days',
    purpose: 'Documentary production for university research',
  },
  {
    id: '#REQ-2024-108',
    borrower: { name: 'Lisa Nguyen', userId: 'STU-3310' },
    equipment: { name: 'Wacom Cintiq 22', location: 'Design Studio' },
    duration: '5 Days',
    purpose: 'Final year design thesis project',
  },
  {
    id: '#REQ-2024-112',
    borrower: { name: 'Prof. Kevin Lee', userId: '770044' },
    equipment: { name: 'Polycom Video Conferencing', location: 'AV Room' },
    duration: '1 Day',
    purpose: 'International faculty meeting',
  },
  {
    id: '#REQ-2024-119',
    borrower: { name: 'Tom Baker', userId: 'STU-9901' },
    equipment: { name: 'DJI Mavic 3 Drone', location: 'Media Lab' },
    duration: '3 Days',
    purpose: 'Aerial photography assignment for journalism class',
  },
];

// ── Handover Fulfillment (tab: Handover) ─────────────────────────────────────
export interface FulfillmentItem { icon: string; name: string; serial: string }
export interface FulfillmentRequest {
  id: string;            // e.g. REQ-8821
  time: string;
  borrowerName: string;
  borrowerRole: string;
  itemCount: number;
  recipient: {
    name: string;
    userId: string;
    department: string;
    designation: string;
    avatar?: string;
  };
  items: FulfillmentItem[];
}

export const MOCK_FULFILLMENTS: FulfillmentRequest[] = [
  {
    id: 'REQ-8821',
    time: '14:20 PM',
    borrowerName: 'Dr. Sarah Jenkins',
    borrowerRole: 'Lecturer • Computer Science',
    itemCount: 2,
    recipient: {
      name: 'Dr. Sarah Jenkins',
      userId: '4492-3301-LL',
      department: 'Computer Science',
      designation: 'Senior Lecturer',
    },
    items: [
      { icon: 'laptop_mac', name: 'MacBook Pro M2',  serial: 'AP-MB-2024-092' },
      { icon: 'hub',        name: 'USB-C Hub Multi', serial: 'AC-HB-2023-441' },
    ],
  },
  {
    id: 'REQ-8790',
    time: '12:15 PM',
    borrowerName: 'Marcus Holloway',
    borrowerRole: 'Student • Final Year Project',
    itemCount: 1,
    recipient: {
      name: 'Marcus Holloway',
      userId: 'STU-7742',
      department: 'Computer Engineering',
      designation: 'Final Year Student',
    },
    items: [{ icon: 'tablet_mac', name: 'iPad Air 5th Gen', serial: 'AP-IA-2023-055' }],
  },
  {
    id: 'REQ-8785',
    time: '09:45 AM',
    borrowerName: 'Admin: IT Services',
    borrowerRole: 'Department • Infrastructure',
    itemCount: 5,
    recipient: {
      name: 'IT Services Dept.',
      userId: 'DEPT-IT-001',
      department: 'Infrastructure',
      designation: 'Department Account',
    },
    items: [
      { icon: 'router',          name: 'Cisco Catalyst Switch', serial: 'CC-SW-2022-007' },
      { icon: 'desktop_windows', name: 'Dell OptiPlex 3090',    serial: 'DL-OP-2023-034' },
      { icon: 'keyboard',        name: 'Logitech MX Keys',      serial: 'LG-KB-2024-019' },
      { icon: 'monitor',         name: 'Dell 24" Monitor',      serial: 'DL-MN-2023-088' },
      { icon: 'cable',           name: 'HDMI Cable Bundle',     serial: 'GEN-CAB-2024' },
    ],
  },
];

// ── Active Loans (tab: Collect) ───────────────────────────────────────────────
export type LoanStatus = 'Overdue' | 'Due Today' | 'Active';

export interface ActiveLoan {
  id: string;
  borrower: { name: string; idLabel: string; avatar?: string };
  status: LoanStatus;
  itemCount: number;
  itemNames: string;
  dueLabel: string;
  dueColor: 'red' | 'yellow' | 'slate';
  dueIcon: string;
  borrowedDate: string;
}

export const MOCK_ACTIVE_LOANS: ActiveLoan[] = [
  {
    id: 'LOAN-001',
    borrower: { name: 'Dr. Sarah Jenkins', idLabel: 'Faculty ID: #F-1029' },
    status: 'Overdue',
    itemCount: 2,
    itemNames: 'Sony Alpha A7 IV, 24-70mm Lens',
    dueLabel: 'Due Oct 24, 2024',
    dueColor: 'red',
    dueIcon: 'event_busy',
    borrowedDate: 'Oct 17, 2024',
  },
  {
    id: 'LOAN-002',
    borrower: { name: 'James Wilson', idLabel: 'Student ID: #S-8821' },
    status: 'Due Today',
    itemCount: 1,
    itemNames: 'Wacom Intuos Pro L',
    dueLabel: 'Due Today, 5:00 PM',
    dueColor: 'yellow',
    dueIcon: 'event',
    borrowedDate: 'Oct 26, 2024',
  },
  {
    id: 'LOAN-003',
    borrower: { name: 'Maria Garcia', idLabel: 'Student ID: #S-4432' },
    status: 'Active',
    itemCount: 3,
    itemNames: 'MacBook Pro M2, Laptop Stand, Mouse',
    dueLabel: 'Due Oct 30, 2024',
    dueColor: 'slate',
    dueIcon: 'calendar_today',
    borrowedDate: 'Oct 20, 2024',
  },
];

// ── History / Audit Log (tab: History) ───────────────────────────────────────
export type EventType = 'Handover' | 'Return' | 'Reject';

export interface HistoryRecord {
  id: string;
  eventType: EventType;
  logId: string;
  recipient: { initials: string; name: string; role: string; avatarBg: string; avatarColor: string };
  equipment: { icon: string; name: string };
  date: string;
  time: string;
  condition: string;
  conditionColor: string;
}

export const MOCK_HISTORY: HistoryRecord[] = [
  {
    id: 'H1',
    eventType: 'Handover',
    logId: '#H-2024-0012',
    recipient: { initials: 'SC', name: 'Sarah Connor',  role: 'Faculty Member', avatarBg: 'bg-blue-100',   avatarColor: 'text-blue-600'   },
    equipment: { icon: 'laptop_mac',    name: 'MacBook Pro M2 (SN: 9921)'  },
    date: 'Oct 24, 2024', time: '10:45 AM',
    condition: 'Mint Condition', conditionColor: 'text-emerald-500',
  },
  {
    id: 'H2',
    eventType: 'Return',
    logId: '#R-2024-0008',
    recipient: { initials: 'JD', name: 'James Doe',     role: 'Student',       avatarBg: 'bg-purple-100', avatarColor: 'text-purple-600' },
    equipment: { icon: 'tablet_android', name: 'iPad Air (SN: 1102)'          },
    date: 'Oct 23, 2024', time: '03:20 PM',
    condition: 'Scratched Screen', conditionColor: 'text-amber-500',
  },
  {
    id: 'H3',
    eventType: 'Reject',
    logId: '#X-2024-0044',
    recipient: { initials: 'ML', name: 'Mark Lee',      role: 'Guest Speaker', avatarBg: 'bg-slate-100',  avatarColor: 'text-slate-600'  },
    equipment: { icon: 'videocam',       name: 'DSLR Camera (SN: 4432)'       },
    date: 'Oct 22, 2024', time: '09:12 AM',
    condition: 'Major Damage', conditionColor: 'text-rose-500',
  },
  {
    id: 'H4',
    eventType: 'Handover',
    logId: '#H-2024-0011',
    recipient: { initials: 'AW', name: 'Alan Wake',     role: 'External Vendor', avatarBg: 'bg-orange-100', avatarColor: 'text-orange-600' },
    equipment: { icon: 'mic',           name: 'Wireless Mic Set (SN: 221)'   },
    date: 'Oct 21, 2024', time: '01:55 PM',
    condition: 'Good', conditionColor: 'text-slate-500',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export interface EventStyle { pill: string; dot: string; text: string }

export function getEventStyle(type: EventType): EventStyle {
  const map: Record<EventType, EventStyle> = {
    Handover: { pill: 'bg-emerald-100 text-emerald-600', dot: 'bg-emerald-500', text: 'Handover' },
    Return:   { pill: 'bg-blue-100 text-blue-600',       dot: 'bg-blue-500',    text: 'Return'   },
    Reject:   { pill: 'bg-rose-100 text-rose-600',       dot: 'bg-rose-500',    text: 'Reject'   },
  };
  return map[type];
}

export function getLoanStatusStyle(status: LoanStatus) {
  const map = {
    Overdue:   { badge: 'bg-red-100 text-red-600',    border: 'border-red-500/50'    },
    'Due Today': { badge: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-500/50' },
    Active:    { badge: 'bg-blue-50 text-blue-600',   border: 'border-white/50'      },
  };
  return map[status];
}
