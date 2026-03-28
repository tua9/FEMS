import Equipment from "../../models/Equipment.js";
import Room from "../../models/Room.js"; // ensure Room model is registered for population
import BorrowRequest from "../../models/BorrowRequest.js";
import Schedule from "../../models/Schedule.js";
import User from "../../models/User.js";
import TeacherAttendance from "../../models/TeacherAttendance.js";

/**
 * Lấy danh sách thiết bị mà sinh viên CÓ THỂ MƯỢN ngay lúc này.
 * Chỉ trả về thiết bị trong phòng có ca học đang diễn ra VÀ giảng viên đã điểm danh.
 * - Có search/type → lọc thêm theo từ khóa hoặc danh mục trong phạm vi đó.
 */
export async function get_equipment_list(args = {}) {
    try {
        const { search, type, user_id } = args || {};
        const now = new Date();

        // 1. Kiểm tra thiết bị chưa hoàn trả
        const unreturned = await BorrowRequest.findOne({
            borrowerId: user_id,
            status: 'unreturned',
        }).select('code').lean();

        if (unreturned) {
            return JSON.stringify({ empty: true, reason: 'has_unreturned', message: `Bạn đang có thiết bị chưa hoàn trả (Mã đơn: ${unreturned.code || 'không xác định'}). Vui lòng hoàn trả trước khi mượn thêm.` });
        }

        // 2. Tìm lớp học của sinh viên
        const user = await User.findById(user_id).select('classId').lean();
        if (!user?.classId) {
            return JSON.stringify({ empty: true, reason: 'no_class', message: "Bạn chưa được gán vào lớp học nào." });
        }

        // 2. Tìm các ca học đang diễn ra của lớp sinh viên
        const activeSessions = await Schedule.find({
            classId: user.classId,
            status: { $in: ['scheduled', 'ongoing'] },
            startAt: { $lte: now },
            endAt:   { $gte: now },
        }).select('_id roomId lecturerId').lean();

        if (activeSessions.length === 0) {
            return JSON.stringify({ empty: true, reason: 'no_session', message: "Bạn không có ca học nào đang diễn ra tại thời điểm này." });
        }

        // 3. Lọc chỉ những session mà giảng viên đã điểm danh
        const checkedInRoomIds = [];
        for (const session of activeSessions) {
            const attendance = await TeacherAttendance.findOne({
                scheduleId: session._id,
                lecturerId: session.lecturerId,
                checkedInAt: { $ne: null },
                status: 'present',
            }).lean();

            if (attendance) {
                checkedInRoomIds.push(session.roomId);
            }
        }

        if (checkedInRoomIds.length === 0) {
            return JSON.stringify({ empty: true, reason: 'teacher_not_checked_in', message: "Giảng viên của ca học chưa điểm danh. Bạn chưa thể mượn thiết bị lúc này." });
        }

        // 4. Kiểm tra sinh viên đã có đơn pending trong ca học này chưa
        const pendingRequest = await BorrowRequest.findOne({
            borrowerId: user_id,
            scheduleId: { $in: activeSessions.map(s => s._id) },
            status: 'pending',
        }).select('code').lean();

        if (pendingRequest) {
            return JSON.stringify({ empty: true, reason: 'has_pending_request', message: `Bạn đã có đơn mượn đang chờ duyệt (Mã đơn: ${pendingRequest.code || 'không xác định'}). Vui lòng chờ giảng viên xét duyệt.` });
        }

        // 5. Lấy thiết bị trong các phòng hợp lệ
        const query = {
            roomId: { $in: checkedInRoomIds },
            status: 'available',
        };

        if (search) query.name     = { $regex: search, $options: 'i' };
        if (type)   query.category = { $regex: type,   $options: 'i' };

        const list = await Equipment.find(query)
            .populate('roomId', 'name')
            .limit(20)
            .lean();

        if (list.length === 0) {
            return JSON.stringify({ empty: true, reason: 'no_equipment', message: "Không có thiết bị nào còn trống trong phòng học của bạn." });
        }

        // 5. Enrich với borrow status thực tế (1 query batch)
        const equipmentIds = list.map(eq => eq._id);
        const activeRequests = await BorrowRequest.find({
            equipmentId: { $in: equipmentIds },
            status: { $in: ['approved', 'handed_over', 'returning'] },
        }).select('equipmentId status').lean();

        const activeMap = {};
        for (const req of activeRequests) {
            activeMap[req.equipmentId.toString()] = req.status;
        }

        const enriched = list.map(eq => {
            const reqStatus = activeMap[eq._id.toString()];
            let borrowStatus = 'available';

            if (reqStatus === 'handed_over' || reqStatus === 'returning') {
                borrowStatus = 'in_use';
            } else if (reqStatus === 'approved') {
                borrowStatus = 'reserved';
            }

            return {
                code:        eq.code,
                name:        eq.name,
                category:    eq.category,
                borrowStatus,
                room:        eq.roomId?.name || null,
            };
        });

        return JSON.stringify(enriched);
    } catch (error) {
        console.error('get_equipment_list logic error:', error.message);
        return `Lỗi hệ thống: ${error.message}`;
    }
}

/**
 * Lấy chi tiết một thiết bị theo mã (code) kèm trạng thái mượn thực tế.
 */
export async function get_equipment_detail(args) {
    try {
        const { code } = args;
        if (!code) return "Vui lòng cung cấp mã thiết bị (code).";

        const eq = await Equipment.findOne({ code })
            .populate('roomId', 'name')
            .lean();

        if (!eq) return `Không tìm thấy thiết bị nào có mã "${code}".`;

        const activeRequest = await BorrowRequest.findOne({
            equipmentId: eq._id,
            status: { $in: ['approved', 'handed_over', 'returning'] },
        }).select('status expectedReturnDate').lean();

        let borrowStatus = 'available';
        if (['broken', 'maintenance', 'dispute'].includes(eq.status)) {
            borrowStatus = 'unavailable';
        } else if (activeRequest) {
            borrowStatus = ['handed_over', 'returning'].includes(activeRequest.status)
                ? 'in_use'
                : 'reserved';
        }

        return JSON.stringify({
            code:            eq.code,
            name:            eq.name,
            category:        eq.category,
            description:     eq.description,
            technicalStatus: eq.status,
            borrowStatus,
            room:            eq.roomId?.name || null,
            activeRequest:   activeRequest
                ? { status: activeRequest.status, expectedReturnDate: activeRequest.expectedReturnDate }
                : null,
        });
    } catch (error) {
        console.error('get_equipment_detail logic error:', error.message);
        return `Lỗi hệ thống: ${error.message}`;
    }
}
