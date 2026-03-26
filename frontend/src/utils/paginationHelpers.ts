/**
 * 🔧 Pagination Helper Utilities
 * 
 * Giải quyết vấn đề Data Desync (Lỗi 2)
 * Các hàm này đảm bảo tính toán pagination luôn đồng bộ giữa data thực tế và UI
 */

/**
 * Tính toán chỉ số bắt đầu item trong trang hiện tại
 * @param currentPage - Trang hiện tại (1-based)
 * @param itemsPerPage - Số item per page
 * @returns Chỉ số bắt đầu (0-based)
 * 
 * @example
 * getStartIndex(1, 5) // 0
 * getStartIndex(2, 5) // 5
 * getStartIndex(3, 5) // 10
 */
export function getStartIndex(currentPage: number, itemsPerPage: number): number {
  return Math.max(0, (currentPage - 1) * itemsPerPage);
}

/**
 * Tính toán chỉ số kết thúc item trong trang hiện tại
 * @param currentPage - Trang hiện tại (1-based)
 * @param itemsPerPage - Số item per page
 * @returns Chỉ số kết thúc (exclusive, 0-based)
 * 
 * @example
 * getEndIndex(1, 5) // 5
 * getEndIndex(2, 5) // 10
 * getEndIndex(3, 5) // 15
 */
export function getEndIndex(currentPage: number, itemsPerPage: number): number {
  return currentPage * itemsPerPage;
}

/**
 * Tính toán display text: "Showing X to Y of Z"
 * ✅ FIX LỖI 2: Tính chính xác dựa trên currentPage, itemsPerPage, và totalItems thực tế
 * 
 * @param currentPage - Trang hiện tại (1-based)
 * @param itemsPerPage - Số item per page
 * @param totalItems - Tổng số item trong dataset
 * @returns String: "Showing X to Y of Z"
 * 
 * @example
 * getPaginationDisplayText(1, 5, 35) // "Showing 1 to 5 of 35"
 * getPaginationDisplayText(2, 5, 35) // "Showing 6 to 10 of 35"
 * getPaginationDisplayText(7, 5, 35) // "Showing 31 to 35 of 35"
 * getPaginationDisplayText(1, 10, 8) // "Showing 1 to 8 of 8" (trang cuối cùng)
 */
export function getPaginationDisplayText(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
): string {
  if (totalItems === 0) {
    return 'Showing 0 of 0';
  }

  const startNum = getStartIndex(currentPage, itemsPerPage) + 1; // Convert to 1-based
  const endNum = Math.min(getEndIndex(currentPage, itemsPerPage), totalItems);

  return `Showing ${startNum} to ${endNum} of ${totalItems}`;
}

/**
 * Tính toán tổng số trang
 * @param totalItems - Tổng số item
 * @param itemsPerPage - Số item per page
 * @returns Tổng số trang
 * 
 * @example
 * getTotalPages(35, 5) // 7
 * getTotalPages(36, 5) // 8
 * getTotalPages(0, 5) // 1
 */
export function getTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems === 0) return 1;
  return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Validate currentPage để tránh overflow
 * @param currentPage - Trang hiện tại
 * @param totalPages - Tổng số trang
 * @returns Safe page number (trong khoảng [1, totalPages])
 * 
 * @example
 * getSafePage(10, 5) // 5
 * getSafePage(0, 5) // 1
 * getSafePage(3, 5) // 3
 */
export function getSafePage(currentPage: number, totalPages: number): number {
  return Math.max(1, Math.min(currentPage, totalPages));
}

/**
 * Slice array theo pagination
 * @param items - Mảng items
 * @param currentPage - Trang hiện tại (1-based)
 * @param itemsPerPage - Số item per page
 * @returns Mảng items của trang hiện tại
 * 
 * @example
 * const items = [1,2,3,4,5,6,7,8,9,10];
 * sliceByPage(items, 1, 3) // [1,2,3]
 * sliceByPage(items, 2, 3) // [4,5,6]
 * sliceByPage(items, 4, 3) // [10]
 */
export function sliceByPage<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): T[] {
  const start = getStartIndex(currentPage, itemsPerPage);
  const end = getEndIndex(currentPage, itemsPerPage);
  return items.slice(start, end);
}
