// ─── Ticket (richer shape used on the Ticket Center page) ──────────────────
export type TicketStatus = 'Pending' | 'Approved' | 'In Progress' | 'Rejected' | 'Completed';
export type TicketPriority = 'High' | 'Medium' | 'Low' | 'Urgent';

export interface Ticket {
  id: string;
  equipment: string;
  equipmentType: string;
  room: string;
  reporter: { name: string; initials: string };
  // For "In Progress" tab the assignee is shown instead of the reporter
  assignee?: { name: string; initials: string; avatar?: string };
  priority: TicketPriority;
  status: TicketStatus;
}

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'REP-7810', equipment: 'Central AC Unit #12', equipmentType: 'HVAC System',
    room: 'Main Library, L2',
    reporter: { name: 'Dr. Alex Rivers', initials: 'AR' },
    assignee: { name: 'Marcus Thorne', initials: 'MT', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGFNwLU9EfhxGexiaMimmAb95aoYyejy0f0ZdHLub3EAjZ8EgpsK3xk_leqeHmzxqy1L5ImFtgOW72yD-vAi6yNMwNFFX6UgQPBfoJW_b5JcGoomzRcrCh_y2xtl4qrVk7hpZARPei5RgcCLZXxXjRKkL90LBJfGtAi2UYf7xbtW5vRq6-S6pIxWBjZiBvoqnpWKRUqG0iJkKbPEUALJzxLCw8-gC6saLMjkvCg8RFm-ZWEh8kU7z8fwC-HhTIO-Bv6Ihi99Qxf4M' },
    priority: 'High', status: 'Pending',
  },
  {
    id: 'REP-7901', equipment: 'Dell Precision Tower', equipmentType: 'IT Hardware',
    room: 'CS Lab 102',
    reporter: { name: 'Sarah Chen', initials: 'SC' },
    assignee: { name: 'James Doe', initials: 'JD' },
    priority: 'Medium', status: 'Pending',
  },
  {
    id: 'REP-7905', equipment: 'Epson Laser Projector', equipmentType: 'AV Device',
    room: 'Block A, Room 402',
    reporter: { name: 'Mark Peterson', initials: 'MP' },
    assignee: { name: 'Marcus Thorne', initials: 'MT' },
    priority: 'Low', status: 'Approved',
  },
  {
    id: 'REP-7912', equipment: 'Smart Water Heater', equipmentType: 'Plumbing',
    room: 'Dormitory G, Level 1',
    reporter: { name: 'James Lee', initials: 'JL' },
    assignee: { name: 'Elena Kovic', initials: 'EK' },
    priority: 'High', status: 'Approved',
  },
  {
    id: 'REP-7920', equipment: 'Emergency Exit Light', equipmentType: 'Safety Equipment',
    room: 'Block C, Stairwell',
    reporter: { name: 'Grace Hall', initials: 'GH' },
    assignee: { name: 'Marcus Thorne', initials: 'MT' },
    priority: 'Urgent', status: 'In Progress',
  },
  {
    id: 'REP-7935', equipment: 'Laboratory Fume Hood', equipmentType: 'Safety Equipment',
    room: 'Science Bldg, R301',
    reporter: { name: 'Prof. Nguyen', initials: 'PN' },
    assignee: { name: 'Elena Kovic', initials: 'EK' },
    priority: 'High', status: 'In Progress',
  },
  {
    id: 'REP-7944', equipment: 'Network Switch Cabinet', equipmentType: 'IT Hardware',
    room: 'Server Room, L1',
    reporter: { name: 'IT Admin', initials: 'IA' },
    assignee: { name: 'James Doe', initials: 'JD' },
    priority: 'High', status: 'In Progress',
  },
  {
    id: 'REP-7955', equipment: 'Smart Whiteboard Panel', equipmentType: 'AV Device',
    room: 'Block B, Room 201',
    reporter: { name: 'Alice Tan', initials: 'AT' },
    priority: 'High', status: 'Rejected',
  },
  {
    id: 'REP-7960', equipment: 'Broken Door Lock', equipmentType: 'Furniture',
    room: 'Lab 305, Block D',
    reporter: { name: 'Henry Park', initials: 'HP' },
    priority: 'Medium', status: 'Rejected',
  },
  {
    id: 'REP-7870', equipment: 'HP LaserJet Printer', equipmentType: 'IT Hardware',
    room: 'Admin Office, L3',
    reporter: { name: 'Eve Lawson', initials: 'EL' },
    priority: 'Low', status: 'Completed',
  },
  {
    id: 'REP-7880', equipment: 'HVAC Duct System', equipmentType: 'HVAC System',
    room: 'Library, Level 3',
    reporter: { name: 'Frank Wu', initials: 'FW' },
    priority: 'Medium', status: 'Completed',
  },
  {
    id: 'REP-7890', equipment: 'Projector Screen Motor', equipmentType: 'AV Device',
    room: 'Lecture Hall A',
    reporter: { name: 'Jack Lin', initials: 'JL' },
    priority: 'Medium', status: 'Completed',
  },
  // extra Pending tickets so pagination works with 12 total pending
  {
    id: 'REP-8001', equipment: 'Ceiling Fan Unit #5', equipmentType: 'Electrical',
    room: 'Cafeteria, Level 1',
    reporter: { name: 'Charlie Kim', initials: 'CK' },
    priority: 'Medium', status: 'Pending',
  },
  {
    id: 'REP-8010', equipment: 'Water Pump Room B', equipmentType: 'Plumbing',
    room: 'Block B, Basement',
    reporter: { name: 'Diana Ross', initials: 'DR' },
    priority: 'Urgent', status: 'Pending',
  },
  {
    id: 'REP-8022', equipment: 'Broken Window Frame', equipmentType: 'Furniture',
    room: 'Block F, Room 101',
    reporter: { name: 'Bob Ng', initials: 'BN' },
    priority: 'Low', status: 'Pending',
  },
  {
    id: 'REP-8030', equipment: 'Electrical Panel Box', equipmentType: 'Electrical',
    room: 'Block A, Basement',
    reporter: { name: 'Iris Cho', initials: 'IC' },
    priority: 'High', status: 'Pending',
  },
  {
    id: 'REP-8041', equipment: 'Air Purifier Unit', equipmentType: 'HVAC System',
    room: 'Med Lab 204',
    reporter: { name: 'Lena Fox', initials: 'LF' },
    priority: 'Medium', status: 'Pending',
  },
  {
    id: 'REP-8055', equipment: 'Smart TV Display', equipmentType: 'AV Device',
    room: 'Boardroom, L4',
    reporter: { name: 'Oscar Yu', initials: 'OY' },
    priority: 'Low', status: 'Pending',
  },
  {
    id: 'REP-8066', equipment: 'Sink Water Tap', equipmentType: 'Plumbing',
    room: 'Canteen, Ground',
    reporter: { name: 'Mia Tran', initials: 'MT' },
    priority: 'Medium', status: 'Pending',
  },
  {
    id: 'REP-8078', equipment: 'Fire Extinguisher Mount', equipmentType: 'Safety Equipment',
    room: 'Gym, Level 1',
    reporter: { name: 'Kai Santos', initials: 'KS' },
    priority: 'High', status: 'Pending',
  },
  // extra Approved
  {
    id: 'REP-8100', equipment: 'Backup Generator', equipmentType: 'Electrical',
    room: 'Power Room, B1',
    reporter: { name: 'Tom Blake', initials: 'TB' },
    priority: 'Urgent', status: 'Approved',
  },
  {
    id: 'REP-8111', equipment: 'CCTV Camera Unit', equipmentType: 'Safety Equipment',
    room: 'Main Gate',
    reporter: { name: 'Nina Cruz', initials: 'NC' },
    priority: 'Medium', status: 'Approved',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const TABS: { label: string; status: TicketStatus }[] = [
  { label: 'Pending',    status: 'Pending'     },
  { label: 'Approved',   status: 'Approved'    },
  { label: 'In Progress',status: 'In Progress' },
  { label: 'Rejected',   status: 'Rejected'    },
  { label: 'Completed',  status: 'Completed'   },
];

export function getTicketsByStatus(status: TicketStatus): Ticket[] {
  return MOCK_TICKETS.filter((t) => t.status === status);
}

export function getPriorityStyle(priority: TicketPriority): string {
  const map: Record<TicketPriority, string> = {
    Urgent: 'bg-rose-100 text-rose-600',
    High:   'bg-rose-100 text-rose-600',
    Medium: 'bg-amber-100 text-amber-600',
    Low:    'bg-emerald-100 text-emerald-600',
  };
  return map[priority];
}

export function getStatusDisplay(status: TicketStatus): { label: string; color: string; dot: string } {
  const map: Record<TicketStatus, { label: string; color: string; dot: string }> = {
    Pending:     { label: 'Pending',     color: 'text-amber-600',    dot: 'bg-amber-500'    },
    Approved:    { label: 'Approved',    color: 'text-[#232F58]',    dot: 'bg-[#232F58]'    },
    'In Progress':{ label: 'In Progress', color: 'text-blue-600',     dot: 'bg-blue-500'     },
    Rejected:    { label: 'Rejected',    color: 'text-rose-500',     dot: 'bg-rose-500'     },
    Completed:   { label: 'Completed',   color: 'text-emerald-600',  dot: 'bg-emerald-500'  },
  };
  return map[status];
}
