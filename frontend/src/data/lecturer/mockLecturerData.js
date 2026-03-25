/**
 * mockLecturerData.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dữ liệu giả dành riêng cho Lecturer role.
 * Tất cả dữ liệu được derive/filter từ mockDatabase — không hardcode lại.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
 MOCK_BORROW_REQUESTS,
 MOCK_REPORTS,
 MOCK_EQUIPMENT,
 MOCK_ROOMS,
 MOCK_USERS,
 populateBorrowRequest,
 populateReport,
 populateEquipment,
} from '@/data/mockDatabase';

// ─── Re-export populated data ─────────────────────────────────────────────────

/** Tất cả borrow requests đã populated (dùng cho approval center, history...) */
export const ALL_BORROW_REQUESTS = MOCK_BORROW_REQUESTS.map(populateBorrowRequest);

/** Tất cả reports đã populated */
export const ALL_REPORTS = MOCK_REPORTS.map(populateReport);

/** Tất cả equipment đã populated */
export const ALL_EQUIPMENT_POPULATED = MOCK_EQUIPMENT.map(populateEquipment);

// ─── Dashboard — stat cards ───────────────────────────────────────────────────

export const LECTURER_STAT_CARDS= [
 {
 label: 'Equipment Borrowed',
 value: String(ALL_BORROW_REQUESTS.filter(r => r.status === 'approved').length),
 icon: 'laptop_mac',
 route: '/lecturer/equipment',
 hint: 'View Equipment',
 dot: 'bg-blue-400',
 glow: 'glow-blue',
 },
 {
 label: 'Pending Requests',
 value: String(ALL_BORROW_REQUESTS.filter(r => r.status === 'pending').length).padStart(2, '0'),
 icon: 'pending_actions',
 route: '/lecturer/approval',
 hint: 'Review Requests',
 dot: 'bg-amber-400',
 glow: 'glow-amber',
 },
 {
 label: 'Reports Sent',
 value: String(ALL_REPORTS.length),
 icon: 'assignment_turned_in',
 route: '/lecturer/history',
 hint: 'View History',
 dot: 'bg-emerald-400',
 glow: 'glow-emerald',
 },
 {
 label: 'Assigned Rooms',
 value: String(MOCK_ROOMS.filter(r => r.status === 'available').length).padStart(2, '0'),
 icon: 'meeting_room',
 route: '/lecturer/room-status',
 hint: 'View Rooms',
 dot: 'bg-violet-400',
 glow: 'glow-violet',
 },
];

// ─── Dashboard — recent activities ───────────────────────────────────────────

export const LECTURER_ACTIVITIES= [
 {
 id: 'act1',
 type: 'access',
 title: 'Room AL-402 Access Approved',
 subject: MOCK_USERS.find(u => u._id === 'u1')?.displayName ?? 'Student',
 time: '12 mins ago',
 description: 'Approved request for advanced robotics workshop sessions.',
 },
 {
 id: 'act2',
 type: 'return',
 title: 'Equipment Returned',
 subject: MOCK_USERS.find(u => u._id === 'u2')?.displayName ?? 'Student',
 time: '2 hours ago',
 description: `Asset: ${MOCK_EQUIPMENT.find(e => e._id === 'e1')?.name} (${MOCK_EQUIPMENT.find(e => e._id === 'e1')?.code}) returned in perfect condition.`,
 },
 {
 id: 'act3',
 type: 'report',
 title: 'Report Logged',
 subject: 'System',
 time: '4 hours ago',
 description: 'Maintenance report generated for Lab 304 projector.',
 },
];

// ─── Dashboard — upcoming class sessions ─────────────────────────────────────

export const UPCOMING_CLASSES= [
 {
 id: 'c1',
 timeRange: '09:00 AM - 11:30 AM',
 title: 'Advanced Web Design',
 location: MOCK_ROOMS.find(r => r._id === 'r7')?.name ?? 'Room AL-201',
 status: 'active',
 },
 {
 id: 'c2',
 timeRange: '01:30 PM - 03:00 PM',
 title: 'UI/UX Fundamentals',
 location: 'Lab 105 (Design Studio)',
 status: 'upcoming',
 },
 {
 id: 'c3',
 timeRange: '04:00 PM - 05:30 PM',
 title: 'Department Meeting',
 location: 'Main Hall A',
 status: 'upcoming',
 },
];

// ─── Equipment catalog (dùng cho LecturerEquipment page) ─────────────────────

export const LECTURER_EQUIPMENT= MOCK_EQUIPMENT.map(eq => {
 const room = MOCK_ROOMS.find(r => r._id === eq.room_id);
 let status = 'AVAILABLE';
 if (!eq.available) status = 'IN USE';
 if (eq.status === 'maintenance') status = 'MAINTENANCE';
 return {
 id: eq._id,
 assetId: eq.code ?? eq._id,
 name: eq.name,
 category: eq.category,
 location: room ? room.name.toUpperCase() : 'STORAGE',
 status,
 };
});

// ─── Pending borrow requests (dùng cho ApprovalCenter) ───────────────────────

const formatPeriod = (borrow, ret) => {
 const b = new Date(borrow);
 const r = new Date(ret);
 const opts = { day: 'numeric', month: 'short', year: 'numeric' };
 return `${b.toLocaleDateString('en-GB', opts)} - ${r.toLocaleDateString('en-GB', opts)}`;
};

const mapStatus = (s)=> {
 const map= {
 pending: 'PENDING',
 approved: 'APPROVED',
 rejected: 'REJECTED',
 returned: 'RETURNED',
 };
 return map[s] ?? ('PENDING');
};

export const LECTURER_PENDING_REQUESTS= MOCK_BORROW_REQUESTS.map(br => {
 const user = MOCK_USERS.find(u => u._id === br.user_id);
 const equip = MOCK_EQUIPMENT.find(e => e._id === br.equipment_id);
 return {
 id: `REQ-${br._id.slice(-3).padStart(7, '2024-0')}`,
 studentName: user?.displayName ?? 'Unknown',
 studentId: user?.username?.toUpperCase() ?? br.user_id,
 studentAvatar: user?.avatarUrl ?? `https://picsum.photos/100/100?random=${br._id}`,
 equipmentName: equip?.name ?? 'Unknown Equipment',
 assetId: equip?.code ?? equip?._id ?? '',
 period: formatPeriod(br.borrow_date, br.return_date),
 category: br.type === 'equipment' ? 'Academic Project' : 'Infrastructure',
 status: mapStatus(br.status),
 };
});

// ─── Room list (dùng cho RoomStatus pages) ───────────────────────────────────

export const LECTURER_ROOMS= MOCK_ROOMS.map(room => ({
 id: room._id,
 name: room.name,
 type: room.type,
 status: room.status,
 building: room.building_id ?? 'Unknown',
}));
