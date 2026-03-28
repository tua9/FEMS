import { BORROW_STATUS } from '@/constants';

/**
 * Tính toán xem đơn mượn có đang quá hạn không (Overdue)
 * Dựa trên ngày hệ thống (Virtual Time Status).
 */
export const isRequestOverdue = (request)=> {
 if (!request || !request.expectedReturnDate) return false;

 if (request.status === BORROW_STATUS.HANDED_OVER || request.status === 'borrowing') { // 'borrowing' là legacy alias
 return new Date() > new Date(request.expectedReturnDate);
 }
 return false;
};

/**
 * Chuyển status Request DB sang Nhãn hiển thị UI chuẩn hóa
 */
export const getBorrowRequestDisplayStatus = (request)=> {
 if (!request) return 'Unknown';
 if (isRequestOverdue(request)) return 'Overdue';

 if (request.status === BORROW_STATUS.APPROVED) {
 const bDate = new Date(request.borrowDate);
 bDate.setHours(17, 0, 0, 0);
 if (new Date() > bDate) {
 return 'Late Pickup';
 }
 }

 switch (request.status) {
 case BORROW_STATUS.HANDED_OVER:
 case 'borrowing': // legacy alias
 return 'Borrowing';
 case BORROW_STATUS.RETURNED:
 case 'closed': // legacy alias
 return 'Closed';
 default:
 return request.status.charAt(0).toUpperCase() + request.status.slice(1);
 }
};
