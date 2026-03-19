import type { BorrowRequest } from '../data/mockModels';

/**
 * Tính toán xem đơn mượn có đang quá hạn không (Overdue)
 * Dựa trên ngày hệ thống (Virtual Time Status).
 */
export const isRequestOverdue = (request: BorrowRequest): boolean => {
  if (!request || !request.return_date) return false;
  
  if (request.status === 'handed_over' || request.status === 'borrowing') {
    return new Date() > new Date(request.return_date);
  }
  return false;
};

/**
 * Chuyển status Request DB sang Nhãn hiển thị UI chuẩn hóa
 */
export const getBorrowRequestDisplayStatus = (request: BorrowRequest): string => {
  if (!request) return 'Unknown';
  if (isRequestOverdue(request)) return 'Overdue';
  
  if (request.status === 'approved') {
    const bDate = new Date(request.borrow_date);
    bDate.setHours(17, 0, 0, 0);
    if (new Date() > bDate) {
      return 'Late Pickup';
    }
  }
  
  switch (request.status) {
    case 'handed_over':
    case 'borrowing':
      return 'Borrowing';
    case 'returned':
    case 'closed':
      return 'Closed';
    default:
      return request.status.charAt(0).toUpperCase() + request.status.slice(1);
  }
};
