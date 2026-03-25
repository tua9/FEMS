/**
 * mockDatabase.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dữ liệu giả (mock) tổng hợp cho toàn bộ hệ thống FEMS, phản ánh đúng cấu
 * trúc backend models (User, Building, Room, Equipment, BorrowRequest, Report).
 *
 * Đây là nguồn dữ liệu trung tâm — các mock file theo role sẽ lọc/transform
 * từ đây thay vì định nghĩa dữ liệu riêng lẻ.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── USERS ────────────────────────────────────────────────────────────────────

export const MOCK_USERS= [
 // Admins
 { _id: 'u0', username: 'admin01', email: 'admin01@fpt.edu.vn', displayName: 'Admin FPT', role: 'admin', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },

 // Students
 { _id: 'u1', username: 'se160942', email: 'se160942@fpt.edu.vn', displayName: 'Johnathan Chen', role: 'student', avatarUrl: 'https://picsum.photos/100/100?random=1', createdAt: '2024-08-01T00:00:00Z', updatedAt: '2024-08-01T00:00:00Z' },
 { _id: 'u2', username: 'se154432', email: 'se154432@fpt.edu.vn', displayName: 'Sarah Nguyen', role: 'student', avatarUrl: 'https://picsum.photos/100/100?random=2', createdAt: '2024-08-01T00:00:00Z', updatedAt: '2024-08-01T00:00:00Z' },
 { _id: 'u3', username: 'ai170291', email: 'ai170291@fpt.edu.vn', displayName: 'Mark Peterson', role: 'student', avatarUrl: 'https://picsum.photos/100/100?random=3', createdAt: '2024-08-01T00:00:00Z', updatedAt: '2024-08-01T00:00:00Z' },
 { _id: 'u4', username: 'se180001', email: 'se180001@fpt.edu.vn', displayName: 'Lisa Tran', role: 'student', avatarUrl: 'https://picsum.photos/100/100?random=4', createdAt: '2024-08-01T00:00:00Z', updatedAt: '2024-08-01T00:00:00Z' },

 // Lecturers
 { _id: 'u10', username: 'dr.rivers', email: 'alex.rivers@fpt.edu.vn', displayName: 'Dr. Alex Rivers', role: 'lecturer', avatarUrl: 'https://picsum.photos/100/100?random=10', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
 { _id: 'u11', username: 'sarah.jenkins', email: 'sarah.jenkins@fpt.edu.vn', displayName: 'Prof. Sarah Jenkins', role: 'lecturer', avatarUrl: 'https://picsum.photos/100/100?random=11', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
 { _id: 'u12', username: 'dr.lee', email: 'david.lee@fpt.edu.vn', displayName: 'Dr. David Lee', role: 'lecturer', avatarUrl: 'https://picsum.photos/100/100?random=12', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },

 // Technicians
 { _id: 'u20', username: 'tech.marcus', email: 'marcus.thorne@fpt.edu.vn', displayName: 'Marcus Thorne', role: 'technician', avatarUrl: 'https://picsum.photos/100/100?random=20', createdAt: '2022-06-01T00:00:00Z', updatedAt: '2022-06-01T00:00:00Z' },
 { _id: 'u21', username: 'tech.nina', email: 'nina.cruz@fpt.edu.vn', displayName: 'Nina Cruz', role: 'technician', avatarUrl: 'https://picsum.photos/100/100?random=21', createdAt: '2022-06-01T00:00:00Z', updatedAt: '2022-06-01T00:00:00Z' },
];

// ─── BUILDINGS ───────────────────────────────────────────────────────────────

export const MOCK_BUILDINGS= [
 { _id: 'b1', name: 'FPT Tower A', status: 'active', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2020-01-01T00:00:00Z' },
 { _id: 'b2', name: 'FPT Tower B', status: 'active', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2020-01-01T00:00:00Z' },
 { _id: 'b3', name: 'Main Library', status: 'active', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2020-01-01T00:00:00Z' },
 { _id: 'b4', name: 'CS Lab Block', status: 'active', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2020-01-01T00:00:00Z' },
];

// ─── ROOMS ───────────────────────────────────────────────────────────────────

export const MOCK_ROOMS= [
 { _id: 'r1', name: 'Lab Room 201', type: 'lab', status: 'available', building_id: 'b1', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'r2', name: 'Lab Room 402', type: 'lab', status: 'available', building_id: 'b1', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'r3', name: 'Room 305', type: 'classroom', status: 'occupied', building_id: 'b2', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'r4', name: 'Auditorium A', type: 'meeting', status: 'available', building_id: 'b2', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'r5', name: 'Library A', type: 'other', status: 'available', building_id: 'b3', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'r6', name: 'CS Lab 102', type: 'lab', status: 'occupied', building_id: 'b4', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'r7', name: 'Room AL-201', type: 'classroom', status: 'available', building_id: 'b1', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'r8', name: 'Room AL-402', type: 'lab', status: 'maintenance', building_id: 'b1', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-15T00:00:00Z' },
 { _id: 'r9', name: 'Media Lab', type: 'lab', status: 'available', building_id: 'b2', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'r10', name: 'Studio B', type: 'other', status: 'available', building_id: 'b2', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'r11', name: 'Server Room B1', type: 'office', status: 'available', building_id: 'b4', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'r12', name: 'Resource Desk', type: 'office', status: 'available', building_id: 'b1', createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
];

// ─── EQUIPMENT ───────────────────────────────────────────────────────────────

export const MOCK_EQUIPMENT= [
 { _id: 'e1', name: 'MacBook Pro M2', category: 'laptop', available: true, status: 'good', room_id: 'r2', borrowed_by, code: 'FPT-LAP-082', createdAt: '2023-03-15T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'e2', name: '4K Laser Projector', category: 'projector', available: true, status: 'maintenance', room_id: 'r4', borrowed_by, code: 'FPT-PJ-014', createdAt: '2021-07-08T00:00:00Z', updatedAt: '2024-10-15T00:00:00Z' },
 { _id: 'e3', name: 'iPad Air 5th Gen', category: 'tablet', available: false, status: 'good', room_id: 'r5', borrowed_by: 'u3', code: 'FPT-TAB-055', createdAt: '2023-09-01T00:00:00Z', updatedAt: '2024-10-20T00:00:00Z' },
 { _id: 'e4', name: 'UltraWide Monitor', category: 'monitor', available: true, status: 'good', room_id: 'r3', borrowed_by, code: 'FPT-MN-033', createdAt: '2022-11-20T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'e5', name: 'Sony A7 IV Camera', category: 'camera', available: true, status: 'good', room_id: 'r9', borrowed_by, code: 'FPT-CAM-011', createdAt: '2023-04-10T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'e6', name: 'Focusrite Interface', category: 'audio', available: true, status: 'good', room_id: 'r10', borrowed_by, code: 'FPT-AUD-007', createdAt: '2023-02-20T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'e7', name: 'Dell XPS 15', category: 'laptop', available: false, status: 'maintenance', room_id, borrowed_by: 'u2', code: 'FPT-LAP-097', createdAt: '2023-07-21T00:00:00Z', updatedAt: '2024-10-18T00:00:00Z' },
 { _id: 'e8', name: 'Epson Smart Projector', category: 'projector', available: true, status: 'good', room_id: 'r7', borrowed_by, code: 'FPT-PJ-022', createdAt: '2022-05-10T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'e9', name: 'HP LaserJet Enterprise',category: 'printer', available: true, status: 'good', room_id: 'r1', borrowed_by, code: 'FPT-PR-002', createdAt: '2022-06-30T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'e10', name: 'Cisco Catalyst Switch', category: 'network', available: true, status: 'good', room_id: 'r11', borrowed_by, code: 'FPT-RO-007', createdAt: '2019-08-22T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
 { _id: 'e11', name: 'Dell Precision Tower', category: 'other', available: false, status: 'broken', room_id, borrowed_by, code: 'FPT-PC-014', createdAt: '2020-04-12T00:00:00Z', updatedAt: '2024-10-05T00:00:00Z' },
 { _id: 'e12', name: 'Smart Whiteboard', category: 'other', available: true, status: 'good', room_id: 'r6', borrowed_by, code: 'FPT-OT-001', createdAt: '2023-02-10T00:00:00Z', updatedAt: '2024-10-01T00:00:00Z' },
];

// ─── BORROW REQUESTS ─────────────────────────────────────────────────────────

export const MOCK_BORROW_REQUESTS= [
 {
 _id: 'br1', user_id: 'u1', equipment_id: 'e1', room_id,
 type: 'equipment', status: 'returned',
 processed_by: 'u10', borrow_date: '2024-10-24T09:00:00Z', return_date: '2024-10-24T12:00:00Z',
 note: 'CS-405 Lab session', createdAt: '2024-10-23T10:00:00Z', updatedAt: '2024-10-24T12:05:00Z',
 },
 {
 _id: 'br2', user_id: 'u2', equipment_id: 'e7', room_id,
 type: 'equipment', status: 'approved',
 processed_by: 'u10', borrow_date: '2024-10-22T14:00:00Z', return_date: '2024-10-24T16:00:00Z',
 note: 'ENG-101 practical', createdAt: '2024-10-21T09:00:00Z', updatedAt: '2024-10-22T14:10:00Z',
 },
 {
 _id: 'br3', user_id: 'u3', equipment_id: 'e3', room_id,
 type: 'equipment', status: 'rejected',
 processed_by: 'u10', borrow_date: '2024-10-25T08:00:00Z', return_date: '2024-10-26T17:00:00Z',
 note: 'Photography assignment', createdAt: '2024-10-24T15:00:00Z', updatedAt: '2024-10-24T16:00:00Z',
 },
 {
 _id: 'br4', user_id: 'u1', equipment_id: 'e5', room_id,
 type: 'equipment', status: 'returned',
 processed_by: 'u11', borrow_date: '2024-10-15T09:00:00Z', return_date: '2024-10-15T17:00:00Z',
 note: 'Media project', createdAt: '2024-10-14T11:00:00Z', updatedAt: '2024-10-15T17:05:00Z',
 },
 {
 _id: 'br5', user_id: 'u4', equipment_id: 'e8', room_id,
 type: 'equipment', status: 'pending',
 processed_by, borrow_date: '2024-10-28T08:00:00Z', return_date: '2024-10-30T17:00:00Z',
 note: 'Seminar presentation', createdAt: '2024-10-25T09:00:00Z', updatedAt: '2024-10-25T09:00:00Z',
 },
 {
 _id: 'br6', user_id: 'u2', equipment_id: 'e1', room_id,
 type: 'equipment', status: 'pending',
 processed_by, borrow_date: '2024-10-27T09:00:00Z', return_date: '2024-10-27T12:00:00Z',
 note: 'Academic project', createdAt: '2024-10-25T13:00:00Z', updatedAt: '2024-10-25T13:00:00Z',
 },
 {
 _id: 'br7', user_id: 'u3', equipment_id: 'e4', room_id,
 type: 'equipment', status: 'returned',
 processed_by: 'u10', borrow_date: '2024-10-12T08:30:00Z', return_date: '2024-10-12T10:30:00Z',
 note: 'MAT-101 presentation', createdAt: '2024-10-11T14:00:00Z', updatedAt: '2024-10-12T10:40:00Z',
 },
];

// ─── REPORTS ─────────────────────────────────────────────────────────────────

export const MOCK_REPORTS= [
 {
 _id: 'rep1', user_id: 'u1', equipment_id, room_id: 'r8',
 type: 'infrastructure', status: 'approved',
 processed_by: 'u20', img, description: 'Projector lamp flickering, needs replacement.',
 createdAt: '2024-10-25T08:00:00Z', updatedAt: '2024-10-25T10:00:00Z',
 },
 {
 _id: 'rep2', user_id: 'u2', equipment_id: 'e11', room_id,
 type: 'equipment', status: 'pending',
 processed_by, img, description: 'GPU failure, cannot boot properly.',
 createdAt: '2024-10-24T14:00:00Z', updatedAt: '2024-10-24T14:00:00Z',
 },
 {
 _id: 'rep3', user_id: 'u10', equipment_id, room_id: 'r6',
 type: 'infrastructure', status: 'pending',
 processed_by, img, description: 'HVAC not working in CS Lab 102.',
 createdAt: '2024-10-22T10:00:00Z', updatedAt: '2024-10-22T10:00:00Z',
 },
 {
 _id: 'rep4', user_id: 'u3', equipment_id: 'e2', room_id,
 type: 'equipment', status: 'rejected',
 processed_by: 'u20', img, description: 'HDMI port damaged on projector.',
 createdAt: '2024-10-20T09:00:00Z', updatedAt: '2024-10-20T11:00:00Z',
 },
 {
 _id: 'rep5', user_id: 'u1', equipment_id, room_id: 'r3',
 type: 'infrastructure', status: 'approved',
 processed_by: 'u20', img, description: 'Electrical issue: short circuit at Room 305.',
 createdAt: '2024-10-18T07:30:00Z', updatedAt: '2024-10-18T09:00:00Z',
 },
 {
 _id: 'rep6', user_id: 'u4', equipment_id: 'e12', room_id,
 type: 'equipment', status: 'approved',
 processed_by: 'u21', img, description: 'Smart whiteboard touch screen not responding.',
 createdAt: '2024-10-15T11:00:00Z', updatedAt: '2024-10-15T13:00:00Z',
 },
 {
 _id: 'rep7', user_id: 'u2', equipment_id, room_id: 'r11',
 type: 'infrastructure', status: 'approved',
 processed_by: 'u20', img, description: 'Network switch cabinet fan making loud noise.',
 createdAt: '2024-10-12T08:00:00Z', updatedAt: '2024-10-12T10:30:00Z',
 },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export const getUserById = (id) => MOCK_USERS.find(u => u._id === id);
export const getBuildingById = (id) => MOCK_BUILDINGS.find(b => b._id === id);
export const getRoomById = (id) => MOCK_ROOMS.find(r => r._id === id);
export const getEquipmentById = (id) => MOCK_EQUIPMENT.find(e => e._id === id);

/** Populate a BorrowRequest with related objects (like Mongoose .populate()) */
export function populateBorrowRequest(br) {
 return {
 ...br,
 user: br.user_id ? getUserById(br.user_id) : undefined,
 equipment: br.equipment_id ? getEquipmentById(br.equipment_id) : undefined,
 room: br.room_id ? getRoomById(br.room_id) : undefined,
 processor: br.processed_by ? getUserById(br.processed_by) : undefined,
 };
}

/** Populate a Report with related objects */
export function populateReport(rep) {
 return {
 ...rep,
 user: rep.user_id ? getUserById(rep.user_id) : undefined,
 equipment: rep.equipment_id ? getEquipmentById(rep.equipment_id) : undefined,
 room: rep.room_id ? getRoomById(rep.room_id) : undefined,
 processor: rep.processed_by ? getUserById(rep.processed_by) : undefined,
 };
}

/** Populate Equipment with room and borrower */
export function populateEquipment(eq) {
 return {
 ...eq,
 room: eq.room_id ? getRoomById(eq.room_id) : undefined,
 borrower: eq.borrowed_by ? getUserById(eq.borrowed_by) : undefined,
 };
}
