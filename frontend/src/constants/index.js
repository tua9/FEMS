// Shared status constants — sync với backend enums.
// Nếu backend thêm/đổi status → chỉ cần sửa tại đây.

/**
 * BorrowRequest.status
 * Backend enum: ['pending','approved','rejected','handed_over','returning','returned','cancelled']
 */
export const BORROW_STATUS = Object.freeze({
  PENDING:     'pending',
  APPROVED:    'approved',
  REJECTED:    'rejected',
  HANDED_OVER: 'handed_over',
  RETURNING:   'returning',
  RETURNED:    'returned',
  CANCELLED:   'cancelled',
});

/**
 * Report.status
 * Backend enum: ['pending','approved','rejected','processing','fixed','cancelled']
 */
export const REPORT_STATUS = Object.freeze({
  PENDING:    'pending',
  APPROVED:   'approved',
  REJECTED:   'rejected',
  PROCESSING: 'processing',
  FIXED:      'fixed',
  CANCELLED:  'cancelled',
});

/**
 * Equipment.status (tình trạng vật lý, không phải trạng thái mượn)
 * Backend enum: ['available','maintenance','broken']
 */
export const EQUIPMENT_STATUS = Object.freeze({
  AVAILABLE:   'available',
  MAINTENANCE: 'maintenance',
  BROKEN:      'broken',
});

/**
 * Room.status
 * Backend enum: ['available','occupied','maintenance']
 */
export const ROOM_STATUS = Object.freeze({
  AVAILABLE:   'available',
  OCCUPIED:    'occupied',
  MAINTENANCE: 'maintenance',
});

/**
 * Schedule.status
 * Backend enum: ['scheduled','ongoing','completed','cancelled']
 */
export const SCHEDULE_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  ONGOING:   'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});
