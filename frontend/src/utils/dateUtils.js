/**
 * dateUtils.js — Tiện ích ngày giờ, luôn theo múi giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7).
 *
 * Lý do cần file này:
 *   - `new Date().toISOString().slice(0, 10)` trả về ngày theo giờ UTC.
 *   - Tại Việt Nam (UTC+7), từ 00:00 → 07:00 sáng, ngày UTC vẫn là ngày HÔM QUA,
 *     dẫn đến query lịch học không tìm thấy dữ liệu dù lịch đã được tạo đúng.
 *   - Toàn bộ code phải dùng các hàm dưới đây thay vì thao tác Date trực tiếp.
 */

const VN_TZ = 'Asia/Ho_Chi_Minh';

// ─── Helpers dạng chuỗi YYYY-MM-DD ───────────────────────────────────────────

/**
 * Trả về ngày hôm nay dạng "YYYY-MM-DD" theo giờ Việt Nam.
 * Dùng thay thế hoàn toàn cho `new Date().toISOString().slice(0, 10)`.
 */
export function getTodayVN() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: VN_TZ }).format(new Date());
}

/**
 * Chuyển một Date (hoặc string/timestamp) thành "YYYY-MM-DD" theo giờ Việt Nam.
 */
export function toVNDateStr(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: VN_TZ }).format(new Date(date));
}

/**
 * Trả về ngày mai dạng "YYYY-MM-DD" theo giờ Việt Nam.
 */
export function getTomorrowVN() {
  return toVNDateStr(new Date(Date.now() + 86_400_000));
}

// ─── Helpers tương thích ngược (giữ nguyên tên cũ) ────────────────────────────

/** @deprecated dùng getTodayVN() */
export const getTodayLocal = getTodayVN;

/** @deprecated dùng toVNDateStr() */
export function toLocalDateString(date) {
  return toVNDateStr(date);
}

/** @deprecated dùng getTomorrowVN() */
export const getTomorrowLocal = getTomorrowVN;

// ─── Helpers datetime ─────────────────────────────────────────────────────────

/**
 * Trả về "YYYY-MM-DDTHH:mm" theo giờ Việt Nam.
 * Dùng cho input type="datetime-local".
 */
export function getNowLocalDateTime() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('sv-SE', {
    timeZone: VN_TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
  // sv-SE cho format "YYYY-MM-DD HH:mm"
  return fmt.format(now).replace(' ', 'T');
}

// ─── Helpers hiển thị ─────────────────────────────────────────────────────────

/**
 * Format ngày hiển thị dạng "dd/MM/yyyy" theo giờ Việt Nam.
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    timeZone: VN_TZ,
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

/**
 * Format giờ hiển thị dạng "HH:mm" theo giờ Việt Nam.
 */
export function formatDisplayTime(date) {
  if (!date) return '—';
  return new Date(date).toLocaleTimeString('vi-VN', {
    timeZone: VN_TZ,
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Format ngày giờ hiển thị dạng "dd/MM HH:mm" theo giờ Việt Nam.
 */
export function formatDisplayDateTime(date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('vi-VN', {
    timeZone: VN_TZ,
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}
