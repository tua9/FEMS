/**
 * src/data/index.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Entry point cho toàn bộ mock data layer.
 * Import từ đây để có IntelliSense đầy đủ.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Core types (phản ánh backend models) ──────────────────────────────────────
export type {
  User, UserRole,
  Building, BuildingStatus,
  Room, RoomType, RoomStatus,
  Equipment, EquipmentStatus, EquipmentCategory,
  BorrowRequest, BorrowRequestType, BorrowRequestStatus,
  Report, ReportType, ReportStatus,
} from './mockModels';

// ── Shared database (nguồn dữ liệu trung tâm) ────────────────────────────────
export {
  MOCK_USERS,
  MOCK_BUILDINGS,
  MOCK_ROOMS,
  MOCK_EQUIPMENT,
  MOCK_BORROW_REQUESTS,
  MOCK_REPORTS,
  getUserById,
  getBuildingById,
  getRoomById,
  getEquipmentById,
  populateBorrowRequest,
  populateReport,
  populateEquipment,
} from './mockDatabase';

// ── Student mock data ─────────────────────────────────────────────────────────
export {
  MY_BORROW_REQUESTS,
  MY_REPORTS,
  STUDENT_STAT_CARDS,
  STUDENT_RECENT_ACTIVITIES,
  STUDENT_UPCOMING_ITEMS,
  STUDENT_ALL_EQUIPMENT,
  ITEMS_PER_PAGE,
} from './student/mockStudentData';

// ── Lecturer mock data ────────────────────────────────────────────────────────
export {
  ALL_BORROW_REQUESTS,
  ALL_REPORTS,
  ALL_EQUIPMENT_POPULATED,
  LECTURER_STAT_CARDS,
  LECTURER_ACTIVITIES,
  UPCOMING_CLASSES,
  LECTURER_EQUIPMENT,
  LECTURER_PENDING_REQUESTS,
  LECTURER_ROOMS,
} from './lecturer/mockLecturerData';

// ── Technician mock data ──────────────────────────────────────────────────────
export {
  ALL_REPORTS_POPULATED,
  TECH_EQUIPMENT_SUMMARY,
  TECH_REPORT_SUMMARY,
  TECHNICIAN_KPI,
  BUILDING_HEALTH,
} from './technician/mockTechnicianData';
