/**
 * mockStudentData.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dữ liệu giả dành riêng cho Student role.
 * Lọc/transform từ mockDatabase, không hardcode lại.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
 MOCK_BORROW_REQUESTS,
 MOCK_REPORTS,
 MOCK_EQUIPMENT,
 MOCK_ROOMS,
 populateBorrowRequest,
 populateReport,
} from '@/mocks/mockDatabase';

// Demo student ID (giả sử đây là student đang đăng nhập)
const CURRENT_STUDENT_ID = 'u1';

// ─── Populated data for current student ──────────────────────────────────────

export const MY_BORROW_REQUESTS = MOCK_BORROW_REQUESTS
 .filter(br => br.user_id === CURRENT_STUDENT_ID)
 .map(populateBorrowRequest);

export const MY_REPORTS = MOCK_REPORTS
 .filter(r => r.user_id === CURRENT_STUDENT_ID)
 .map(populateReport);

// ─── Home page — stat cards ───────────────────────────────────────────────────

import { AlertCircle, History, Package, TrendingUp } from 'lucide-react';
const activeBorrows = MY_BORROW_REQUESTS.filter(r => r.status === 'approved').length;
const totalHistory = MY_BORROW_REQUESTS.length;
const pendingReports = MY_REPORTS.filter(r => r.status === 'pending').length;

export const STUDENT_STAT_CARDS= [
 {
 id: 'active-borrows',
 title: 'Active Borrows',
 value: String(activeBorrows),
 icon,
 color: 'bg-blue-500',
 iconShadow: 'shadow-blue-500/40',
 dot: 'bg-blue-400',
 glow: 'glow-blue',
 route: '/student/borrow-history',
 },
 {
 id: 'history',
 title: 'Total History',
 value: String(totalHistory || 24), // fallback 24 cho đẹp UI
 icon,
 color: 'bg-purple-500',
 iconShadow: 'shadow-purple-500/40',
 dot: 'bg-purple-400',
 glow: 'glow-purple',
 route: '/student/borrow-history',
 },
 {
 id: 'pending-reports',
 title: 'Pending Reports',
 value: String(pendingReports || 1),
 icon,
 color: 'bg-orange-500',
 iconShadow: 'shadow-orange-500/40',
 dot: 'bg-orange-400',
 glow: 'glow-orange',
 route: '/student/report',
 },
 {
 id: 'usage',
 title: 'Usage Score',
 value: '92%',
 icon,
 color: 'bg-emerald-500',
 iconShadow: 'shadow-emerald-500/40',
 dot: 'bg-emerald-400',
 glow: 'glow-emerald',
 route: '/student/borrow-history',
 },
];

// ─── Home page — recent activities ───────────────────────────────────────────

export const STUDENT_RECENT_ACTIVITIES= MY_BORROW_REQUESTS
 .slice(0, 3)
 .map((br, idx) => {
 const equip = br.equipment;
 const isReturn = br.status === 'returned';
 return {
 id: idx + 1,
 title: isReturn
 ? `Returned ${equip?.name ?? 'equipment'}`
 : `Borrowed ${equip?.name ?? 'equipment'}`,
 time: idx === 0 ? '2 hours ago' : idx === 1 ? 'Yesterday' : '3 days ago',
 type: isReturn ? 'return' : 'borrow',
 route: '/student/borrow-history',
 };
 })
 .concat(
 MY_REPORTS.slice(0, 1).map((rep, idx) => ({
 id: 10 + idx,
 title: `Submitted issue: ${rep.description?.slice(0, 30) ?? 'Issue reported'}`,
 time: 'Yesterday',
 type: 'report',
 route: '/student/report',
 }))
 );

// ─── Home page — upcoming returns ────────────────────────────────────────────

export const STUDENT_UPCOMING_ITEMS= MY_BORROW_REQUESTS
 .filter(br => br.status === 'approved')
 .slice(0, 3)
 .map((br, idx) => {
 const equip = br.equipment;
 const daysLeft = Math.max(1, 5 - idx * 2);
 return {
 id: idx + 1,
 title: equip?.name ?? 'Equipment',
 due: daysLeft === 1 ? 'Due tomorrow' : `Due in ${daysLeft} days`,
 sku: equip?.code ?? equip?._id ?? '',
 route: '/student/borrow-history',
 };
 });

// ─── Equipment catalog (dùng cho EquipmentPage) ───────────────────────────────

import { Camera, Laptop, Mic, Monitor, TabletSmartphone, Video, Printer, Network } from 'lucide-react';
const CATEGORY_ICON_MAP= {
 laptop,
 projector,
 tablet,
 monitor,
 camera,
 audio,
 printer,
 network,
 other,
};

const LOCATION_KEY_MAP= {
 'r1': 'gamma', 'r2': 'gamma', 'r3': 'gamma',
 'r4': 'alpha', 'r5': 'alpha', 'r6': 'alpha',
 'r7': 'gamma', 'r8': 'gamma', 'r9': 'alpha',
 'r10': 'alpha','r11': 'gamma', 'r12': 'gamma',
};

const mapEquipStatus = (eq) => {
 if (eq.status === 'maintenance') return 'Maintenance';
 if (!eq.available) return 'In Use';
 return 'Available';
};

export const STUDENT_ALL_EQUIPMENT= MOCK_EQUIPMENT.map(eq => {
 const room = MOCK_ROOMS.find(r => r._id === eq.room_id);
 return {
 id: eq._id,
 title: eq.name,
 sku: eq.code ?? eq._id,
 location: room?.name ?? 'Storage',
 locationKey: (eq.room_id ? LOCATION_KEY_MAP[eq.room_id] : 'gamma') ?? 'gamma',
 type: eq.category,
 status: mapEquipStatus(eq),
 icon: CATEGORY_ICON_MAP[eq.category] ?? Monitor,
 };
});

export const ITEMS_PER_PAGE = 4;
