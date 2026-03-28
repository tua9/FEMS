import Schedule from "../../models/Schedule.js";
import User from "../../models/User.js";
import TeacherAttendance from "../../models/TeacherAttendance.js";
import { vnDayRange } from "../../utils/dateVN.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Tính khoảng cách thời gian thân thiện (ví dụ: "15 phút nữa", "2 giờ nữa")
 */
function formatTimeUntil(targetDate) {
    const diffMs = new Date(targetDate) - new Date();
    if (diffMs <= 0) return null;
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 60) return `${diffMin} phút nữa`;
    const hours = Math.floor(diffMin / 60);
    const mins  = diffMin % 60;
    return mins > 0 ? `${hours} giờ ${mins} phút nữa` : `${hours} giờ nữa`;
}

function formatTime(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleTimeString('vi-VN', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh',
    });
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        weekday: 'long', day: '2-digit', month: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
    });
}

// ── Tools ─────────────────────────────────────────────────────────────────────

/**
 * Xem lịch học hôm nay của sinh viên, kèm trạng thái từng ca
 * (đã qua / đang diễn ra / sắp tới / GV đã điểm danh chưa)
 */
export async function get_my_schedule_today(args) {
    try {
        const { user_id } = args;
        const user = await User.findById(user_id).select('classId').lean();
        if (!user?.classId) {
            return JSON.stringify({ empty: true, message: "Bạn chưa được gán vào lớp học nào." });
        }

        const now   = new Date();
        const today = now.toISOString().split('T')[0];

        const schedules = await Schedule.find({
            classId: user.classId,
            date: vnDayRange(today),
            status: { $ne: 'cancelled' },
        })
            .populate('slotId',     'name startTime endTime order')
            .populate('roomId',     'name')
            .populate('lecturerId', 'displayName')
            .sort({ startAt: 1 })
            .lean();

        if (schedules.length === 0) {
            return JSON.stringify({ empty: true, message: "Hôm nay bạn không có ca học nào." });
        }

        const result = await Promise.all(schedules.map(async (sch) => {
            // Trạng thái ca học
            let sessionStatus;
            if (now < new Date(sch.startAt))       sessionStatus = 'upcoming';
            else if (now > new Date(sch.endAt))    sessionStatus = 'ended';
            else                                   sessionStatus = 'ongoing';

            // GV đã điểm danh chưa
            const attendance = await TeacherAttendance.findOne({
                scheduleId: sch._id,
                lecturerId: sch.lecturerId?._id || sch.lecturerId,
                checkedInAt: { $ne: null },
                status: 'present',
            }).lean();

            return {
                title:              sch.title,
                slot:               sch.slotId?.name    || null,
                room:               sch.roomId?.name    || null,
                lecturer:           sch.lecturerId?.displayName || null,
                startTime:          formatTime(sch.startAt),
                endTime:            formatTime(sch.endAt),
                sessionStatus,
                timeUntilStart:     sessionStatus === 'upcoming' ? formatTimeUntil(sch.startAt) : null,
                lecturerCheckedIn:  !!attendance,
                canBorrowNow:       sessionStatus === 'ongoing' && !!attendance,
            };
        }));

        return JSON.stringify(result);
    } catch (error) {
        console.error('get_my_schedule_today logic error:', error.message);
        return `Lỗi hệ thống: ${error.message}`;
    }
}

/**
 * Tìm ca học tiếp theo mà sinh viên có thể mượn thiết bị.
 * Ưu tiên: ca đang diễn ra → ca sắp tới hôm nay → ca gần nhất trong 7 ngày tới.
 */
export async function get_next_borrowable_time(args) {
    try {
        const { user_id } = args;
        const user = await User.findById(user_id).select('classId').lean();
        if (!user?.classId) {
            return JSON.stringify({ empty: true, message: "Bạn chưa được gán vào lớp học nào." });
        }

        const now = new Date();

        // Tìm ca học trong vòng 7 ngày tới (đang chạy hoặc sắp tới)
        const sevenDaysLater = new Date(now);
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

        const upcoming = await Schedule.find({
            classId: user.classId,
            status: { $in: ['scheduled', 'ongoing'] },
            endAt: { $gte: now },
            startAt: { $lte: sevenDaysLater },
        })
            .populate('slotId', 'name startTime endTime')
            .populate('roomId', 'name')
            .populate('lecturerId', 'displayName')
            .sort({ startAt: 1 })
            .lean();

        if (upcoming.length === 0) {
            return JSON.stringify({ empty: true, message: "Không tìm thấy ca học nào trong 7 ngày tới." });
        }

        // Ưu tiên ca đang diễn ra
        const ongoing = upcoming.find(s => new Date(s.startAt) <= now && new Date(s.endAt) >= now);

        const target = ongoing || upcoming[0];

        const isOngoing = !!(ongoing);

        // Kiểm tra GV điểm danh (chỉ có ý nghĩa nếu ca đang diễn ra)
        let lecturerCheckedIn = false;
        if (isOngoing) {
            const attendance = await TeacherAttendance.findOne({
                scheduleId: target._id,
                lecturerId: target.lecturerId?._id || target.lecturerId,
                checkedInAt: { $ne: null },
                status: 'present',
            }).lean();
            lecturerCheckedIn = !!attendance;
        }

        return JSON.stringify({
            sessionStatus:     isOngoing ? 'ongoing' : 'upcoming',
            title:             target.title,
            slot:              target.slotId?.name || null,
            room:              target.roomId?.name || null,
            lecturer:          target.lecturerId?.displayName || null,
            date:              formatDate(target.startAt),
            startTime:         formatTime(target.startAt),
            endTime:           formatTime(target.endAt),
            timeUntilStart:    !isOngoing ? formatTimeUntil(target.startAt) : null,
            lecturerCheckedIn,
            canBorrowNow:      isOngoing && lecturerCheckedIn,
        });
    } catch (error) {
        console.error('get_next_borrowable_time logic error:', error.message);
        return `Lỗi hệ thống: ${error.message}`;
    }
}
