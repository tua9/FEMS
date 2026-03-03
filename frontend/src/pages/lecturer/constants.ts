
import { RequestStatus, Activity, ClassSession, EquipmentItem, BorrowRequest } from './types';

export const ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'access',
    title: 'Room AL-402 Access Approved',
    subject: 'Johnathan Chen',
    time: '12 mins ago',
    description: 'Approved request for advanced robotics workshop sessions.'
  },
  {
    id: '2',
    type: 'return',
    title: 'Equipment Returned',
    subject: 'Sarah Nguyen',
    time: '2 hours ago',
    description: '"Asset: MacBook Pro M2 (FPT-LAP-082) returned in perfect condition."'
  },
  {
    id: '3',
    type: 'report',
    title: 'Report Logged',
    subject: 'System',
    time: '4 hours ago',
    description: 'Maintenance report generated for Lab 304 projector.'
  }
];

export const UPCOMING_CLASSES: ClassSession[] = [
  {
    id: 'c1',
    timeRange: '09:00 AM - 11:30 AM',
    title: 'Advanced Web Design',
    location: 'Room AL-201',
    status: 'active'
  },
  {
    id: 'c2',
    timeRange: '01:30 PM - 03:00 PM',
    title: 'UI/UX Fundamentals',
    location: 'Lab 105 (Design Studio)',
    status: 'upcoming'
  },
  {
    id: 'c3',
    timeRange: '04:00 PM - 05:30 PM',
    title: 'Department Meeting',
    location: 'Main Hall A',
    status: 'upcoming'
  }
];

export const EQUIPMENT: EquipmentItem[] = [
  { id: '1', assetId: 'FPT-LAP-082', name: 'MacBook Pro M2', category: 'laptop', location: 'LAB ROOM 402', status: 'AVAILABLE' },
  { id: '2', assetId: 'FPT-PJ-014', name: '4K Laser Projector', category: 'projector', location: 'RESOURCE DESK', status: 'AVAILABLE' },
  { id: '3', assetId: 'FPT-TAB-055', name: 'iPad Air 5th Gen', category: 'tablet', location: 'LIBRARY A', status: 'IN USE' },
  { id: '4', assetId: 'FPT-MN-033', name: 'UltraWide Monitor', category: 'monitor', location: 'ROOM 205', status: 'AVAILABLE' }
];

export const PENDING_REQUESTS: BorrowRequest[] = [
  {
    id: 'REQ-2024-892',
    studentName: 'Johnathan Chen',
    studentId: 'SE160942',
    studentAvatar: 'https://picsum.photos/100/100?random=1',
    equipmentName: 'MacBook Pro M2',
    assetId: 'FPT-LAP-082',
    period: '24 Oct - 27 Oct 2024',
    category: 'Academic Project',
    status: RequestStatus.PENDING
  },
  {
    id: 'REQ-2024-885',
    studentName: 'Sarah Nguyen',
    studentId: 'SE154432',
    studentAvatar: 'https://picsum.photos/100/100?random=2',
    equipmentName: 'Arduino Robotics Kit',
    assetId: 'FPT-ROB-15',
    period: '26 Oct 2024 (08:00 AM - 05:00 PM)',
    category: 'Lab Session',
    status: RequestStatus.PENDING
  },
  {
    id: 'REQ-2024-842',
    studentName: 'Mark Peterson',
    studentId: 'AI170291',
    studentAvatar: 'https://picsum.photos/100/100?random=3',
    equipmentName: '4K Sony DSLR',
    assetId: 'FPT-CAM-102',
    period: '25 Oct - 26 Oct 2024',
    category: 'External Event',
    status: RequestStatus.PENDING
  }
];
