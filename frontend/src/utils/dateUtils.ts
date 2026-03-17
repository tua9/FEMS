/**
 * dateUtils.ts — Shared date utility
 * Luôn dùng múi giờ local của người dùng (tránh UTC offset gây lỗi "date in past" cho GMT+7)
 */

/**
 * Trả về ngày hôm nay dạng "YYYY-MM-DD" theo giờ local của user.
 * Dùng thay cho `new Date().toISOString().split('T')[0]` (cái đó trả giờ UTC).
 */
export function getTodayLocal(): string {
  const d = new Date();
  return toLocalDateString(d);
}

/**
 * Trả về ngày mai dạng "YYYY-MM-DD" theo giờ local.
 */
export function getTomorrowLocal(): string {
  const d = new Date(Date.now() + 86_400_000);
  return toLocalDateString(d);
}

/**
 * Chuyển một Date thành "YYYY-MM-DD" theo giờ local.
 */
export function toLocalDateString(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/**
 * Trả về thời điểm hiện tại dạng "YYYY-MM-DDTHH:mm" theo giờ local.
 * Dùng cho input type="datetime-local".
 */
export function getNowLocalDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Format ngày cho hiển thị UI, ví dụ: "Mar 14, 2026"
 */
export function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
