/**
 * dateVN.js — Tiện ích ngày giờ phía backend, luôn theo múi giờ Việt Nam (UTC+7).
 *
 * Vấn đề cần giải quyết:
 *   1. `new Date('2026-03-27')` luôn parse là UTC midnight (2026-03-27T00:00:00Z),
 *      đây là chuẩn của ISO 8601 date-only — hoàn toàn đúng.
 *   2. `setHours(h, m, 0, 0)` dùng giờ LOCAL của server. Nếu server chạy UTC,
 *      slot "07:30" sẽ được lưu là 07:30 UTC = 14:30 Việt Nam — SAI 7 tiếng.
 *   3. Bộ lọc date range dùng `setHours` cũng phụ thuộc timezone của server,
 *      gây không nhất quán khi deploy trên các cloud provider khác nhau.
 *
 * Giải pháp:
 *   - Luôn dùng explicit offset +07:00 khi xây dựng datetime.
 *   - Date field trong DB luôn là UTC midnight (2026-03-27T00:00:00Z),
 *     nên day-range filter dùng UTC explicit string là nhất quán nhất.
 */

const VN_TZ = 'Asia/Ho_Chi_Minh'

// ─── Chuỗi ngày YYYY-MM-DD ────────────────────────────────────────────────────

/**
 * Trả về ngày hiện tại theo giờ Việt Nam dạng "YYYY-MM-DD".
 * Đảm bảo đúng dù server chạy ở UTC hay bất kỳ timezone nào.
 */
export const toVNDateStr = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: VN_TZ }).format(new Date(date))

// ─── MongoDB range helpers ────────────────────────────────────────────────────

/**
 * Trả về MongoDB range `{ $gte, $lte }` cho cả ngày theo giờ Việt Nam.
 *
 * Vì date field luôn được lưu là UTC midnight (kết quả của `new Date('YYYY-MM-DD')`),
 * dùng UTC explicit string để bao phủ đúng một ngày lịch:
 *   '2026-03-27' → { $gte: 2026-03-27T00:00:00Z, $lte: 2026-03-27T23:59:59.999Z }
 *
 * @param {string} vnDateStr - Chuỗi "YYYY-MM-DD" theo giờ Việt Nam
 */
export const vnDayRange = (vnDateStr) => ({
  $gte: new Date(`${vnDateStr}T00:00:00.000Z`),
  $lte: new Date(`${vnDateStr}T23:59:59.999Z`),
})

/**
 * Trả về `$gte` bound cho startDate trong range query.
 * @param {string} vnDateStr - "YYYY-MM-DD"
 */
export const vnRangeStart = (vnDateStr) => new Date(`${vnDateStr}T00:00:00.000Z`)

/**
 * Trả về `$lte` bound cho endDate trong range query (bao gồm cả cuối ngày).
 * @param {string} vnDateStr - "YYYY-MM-DD"
 */
export const vnRangeEnd = (vnDateStr) => new Date(`${vnDateStr}T23:59:59.999Z`)

// ─── Xây dựng datetime từ date + time string ──────────────────────────────────

/**
 * Xây dựng một Date từ "YYYY-MM-DD" + "HH:MM" theo giờ Việt Nam (UTC+7).
 *
 * Ví dụ: buildVNDateTime('2026-03-27', '07:30')
 *   → new Date('2026-03-27T07:30:00.000+07:00')
 *   → 2026-03-27T00:30:00.000Z  (UTC)
 *
 * Thay thế pattern cũ:
 *   const base = new Date(data.date)        // UTC midnight ✓
 *   startAt.setHours(sh, sm, 0, 0)          // server local time ✗
 *
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {string} timeStr - "HH:MM"
 * @returns {Date}
 */
export const buildVNDateTime = (dateStr, timeStr) =>
  new Date(`${dateStr}T${timeStr}:00.000+07:00`)
