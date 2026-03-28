/**
 * Maps legacy Vietnamese notification copy (stored in DB) to English for display.
 * New notifications are already created in English on the server.
 */

const LEGACY_TITLE_EXACT = {
  'Yêu cầu mượn bị hủy': 'Borrow request cancelled',
  'Yêu cầu mượn mới': 'New borrow request',
  'Yêu cầu mượn được duyệt': 'Borrow request approved',
  'Yêu cầu mượn bị từ chối': 'Borrow request rejected',
  'Sinh viên đã xác nhận nhận thiết bị': 'Student confirmed receipt',
  'Sinh viên gửi yêu cầu trả thiết bị': 'Return request submitted',
  'Yêu cầu trả thiết bị mới': 'New return request',
  'Thiết bị đã được xác nhận trả': 'Return confirmed',
  'Thiết bị đã được trả': 'Equipment returned',
  'Cảnh báo trả trễ': 'Overdue borrow alert',
}

/** Title may be "Nhắc nhở từ Giảng viên {name}" */
const REMINDER_TITLE_VI = /^Nhắc nhở từ Giảng viên\s*(.*)$/

function translateTitle(title) {
  if (title == null || typeof title !== 'string') return title
  const t = title.trim()
  if (LEGACY_TITLE_EXACT[t]) return LEGACY_TITLE_EXACT[t]
  const m = t.match(REMINDER_TITLE_VI)
  if (m) {
    const name = (m[1] || '').trim()
    return name ? `Reminder from lecturer ${name}` : 'Reminder from your lecturer'
  }
  return title
}

function translateMessage(message) {
  if (message == null || typeof message !== 'string') return message
  let m = message

  const rules = [
    [
      /^Yêu cầu mượn (#\S+) đã bị hủy tự động do ca học đã kết thúc\.$/,
      'Borrow request $1 was automatically cancelled because the class session has ended.',
    ],
    [
      /^(.+) \(sinh viên\) đã tạo yêu cầu mượn thiết bị (.+) \((#\S+)\)\.$/,
      '$1 (student) created a borrow request for $2 ($3).',
    ],
    [
      /^(.+) \(giảng viên\) đã tạo yêu cầu mượn thiết bị (.+) \((#\S+)\)\.$/,
      '$1 (lecturer) created a borrow request for $2 ($3).',
    ],
    [
      /^Yêu cầu mượn (#\S+) đã được duyệt\. Giảng viên sẽ sớm bàn giao thiết bị cho bạn\.(?: Ghi chú: "(.*)")?$/,
      (_full, code, note) => {
        const base = `Borrow request ${code} has been approved. Your lecturer will hand over the equipment soon.`
        return note != null && note !== '' ? `${base} Note: "${note}"` : base
      },
    ],
    [
      /^Yêu cầu mượn (#\S+) đã bị từ chối\. Lý do: (.+)$/,
      'Borrow request $1 was rejected. Reason: $2',
    ],
    [
      /^Sinh viên đã xác nhận nhận thiết bị (.*) \((#\S+)\)\.$/,
      'The student confirmed receipt of $1 ($2).',
    ],
    [
      /^Sinh viên đã gửi yêu cầu trả thiết bị \(Yêu cầu (#\S+)\)\. Vui lòng kiểm tra và xác nhận\.$/,
      'A student submitted a return request (Request $1). Please review and confirm.',
    ],
    [
      /^Sinh viên đã gửi yêu cầu trả thiết bị \(Yêu cầu (#\S+)\)\.$/,
      'A student submitted a return request (Request $1).',
    ],
    [
      /^Giảng viên đã xác nhận bạn trả thiết bị thành công \(Yêu cầu (#\S+)\)\.\s*Cảm ơn bạn!?$/,
      'Your lecturer confirmed that you returned the equipment successfully (Request $1). Thank you!',
    ],
    [
      /^(.+) đã trả thiết bị \(Yêu cầu (#\S+)\)\.$/,
      '$1 returned the equipment (Request $2).',
    ],
    [
      /^Có (\d+) thiết bị đang bị mượn quá hạn\. Vui lòng kiểm tra\.$/,
      '$1 borrowed item(s) are past due. Please review.',
    ],
    [
      /^Vui lòng hoàn trả thiết bị (\S+) sớm nhất có thể\.$/,
      'Please return the equipment for request $1 as soon as possible.',
    ],
  ]

  for (const rule of rules) {
    const [re, repl] = rule
    if (typeof repl === 'function') {
      const match = re.exec(m)
      if (match) return repl(...match)
    } else {
      const next = m.replace(re, repl)
      if (next !== m) return next
    }
  }

  // "Không có lý do" → "No reason given" inside rejection message (if pattern missed edge case)
  m = m.replace(/Lý do: Không có lý do\./g, 'Reason: No reason given.')

  return m
}

/**
 * @param {{ title?: string, message?: string }} n
 * @returns {{ title: string, message: string }}
 */
export function localizeNotificationDisplay(n) {
  return {
    title: translateTitle(n?.title),
    message: translateMessage(n?.message),
  }
}
