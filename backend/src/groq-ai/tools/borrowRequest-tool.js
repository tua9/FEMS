import BorrowRequest from "../../models/BorrowRequest.js";
import Equipment from "../../models/Equipment.js";
import Schedule from "../../models/Schedule.js";
import User from "../../models/User.js";
import TeacherAttendance from "../../models/TeacherAttendance.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

const generateCode = () => {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const random = Array.from({ length: 3 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
    return `BR${year}${month}${random}`;
};

const generateUniqueCode = async () => {
    let code, exists = true;
    while (exists) {
        code = generateCode();
        exists = !!(await BorrowRequest.findOne({ code }));
    }
    return code;
};

const STATUS_LABEL = {
    pending:     'Chờ duyệt',
    approved:    'Đã duyệt – chờ nhận thiết bị',
    rejected:    'Bị từ chối',
    handed_over: 'Đang mượn',
    returning:   'Chờ giảng viên xác nhận trả',
    returned:    'Đã trả xong',
    cancelled:   'Đã hủy',
    unreturned:  'Chưa hoàn trả (quá hạn)',
    dispute:     'Đang tranh chấp',
};

const STATUS_ACTION = {
    pending:     'Đang chờ giảng viên xét duyệt. Vui lòng chờ.',
    approved:    'Giảng viên đã duyệt. Hãy đến gặp giảng viên để nhận thiết bị.',
    rejected:    'Đơn đã bị từ chối.',
    handed_over: 'Bạn đang giữ thiết bị. Nhớ trả trước khi kết thúc ca học.',
    returning:   'Bạn đã gửi yêu cầu trả. Chờ giảng viên xác nhận.',
    returned:    'Hoàn tất. Thiết bị đã được trả thành công.',
    cancelled:   'Đơn đã bị hủy (thường do ca học kết thúc trước khi xử lý xong).',
    unreturned:  'Thiết bị chưa được trả sau khi ca học kết thúc. Cần liên hệ giảng viên ngay.',
    dispute:     'Thiết bị đang trong tình trạng tranh chấp. Vui lòng liên hệ quản trị viên.',
};

function formatVNDate(dateVal) {
    if (!dateVal) return null;
    return new Date(dateVal).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
    });
}

// ── Tools ─────────────────────────────────────────────────────────────────────

/**
 * Tạo đơn mượn thiết bị cho sinh viên theo logic mới:
 * - Phải có ca học đang diễn ra trong phòng chứa thiết bị
 * - Giảng viên của ca đó phải đã điểm danh
 * - Sinh viên không có thiết bị chưa hoàn trả
 */
export async function create_borrow_request(args) {
    try {
        const { user_id, code, purpose, note } = args;

        if (!code) return "Lỗi: Vui lòng cung cấp mã thiết bị (code).";

        // 1. Kiểm tra sinh viên có thiết bị chưa hoàn trả không
        const unreturned = await BorrowRequest.findOne({
            borrowerId: user_id,
            status: 'unreturned',
        }).select('code').lean();

        if (unreturned) {
            return `Bạn đang có thiết bị chưa hoàn trả (Mã đơn: ${unreturned.code || 'không xác định'}). Vui lòng trả thiết bị trước khi mượn thêm.`;
        }

        // 2. Tìm thiết bị theo mã
        const equipment = await Equipment.findOne({ code })
            .populate('roomId', 'name')
            .lean();

        if (!equipment) return `Không tìm thấy thiết bị có mã "${code}".`;

        // 3. Kiểm tra tình trạng kỹ thuật
        if (equipment.status === 'broken') {
            return `Thiết bị "${equipment.name}" đang bị hỏng, không thể mượn.`;
        }
        if (equipment.status === 'maintenance') {
            return `Thiết bị "${equipment.name}" đang trong quá trình bảo trì, không thể mượn.`;
        }
        if (equipment.status === 'dispute') {
            return `Thiết bị "${equipment.name}" đang trong tình trạng tranh chấp, không thể mượn.`;
        }

        // 4. Kiểm tra không có đơn mượn đang hoạt động
        const activeRequest = await BorrowRequest.findOne({
            equipmentId: equipment._id,
            status: { $in: ['approved', 'handed_over', 'returning'] },
        }).lean();

        if (activeRequest) {
            return `Rất tiếc, thiết bị "${equipment.name}" hiện đang được người khác mượn hoặc đã được phê duyệt cho người khác.`;
        }

        // 5. Kiểm tra sinh viên có ca học đang diễn ra trong phòng này không
        const roomId = equipment.roomId?._id || equipment.roomId;
        if (!roomId) {
            return `Thiết bị "${equipment.name}" chưa được gán phòng. Không thể xác định ca học.`;
        }

        const user = await User.findById(user_id).select('classId').lean();
        if (!user?.classId) {
            return "Bạn chưa được gán vào lớp học nào. Vui lòng liên hệ quản trị viên.";
        }

        const now = new Date();
        const session = await Schedule.findOne({
            classId: user.classId,
            roomId,
            status: { $in: ['scheduled', 'ongoing'] },
            startAt: { $lte: now },
            endAt:   { $gte: now },
        }).populate('slotId', 'name').lean();

        if (!session) {
            const roomName = equipment.roomId?.name || 'phòng này';
            return `Bạn không có ca học đang diễn ra tại ${roomName}. Bạn chỉ có thể mượn thiết bị khi đang trong ca học hợp lệ tại phòng chứa thiết bị đó.`;
        }

        // 6. Kiểm tra giảng viên đã điểm danh chưa
        const attendance = await TeacherAttendance.findOne({
            scheduleId: session._id,
            lecturerId: session.lecturerId,
            checkedInAt: { $ne: null },
            status: 'present',
        }).lean();

        if (!attendance) {
            return "Giảng viên của ca học này chưa điểm danh. Vui lòng đợi giảng viên điểm danh trước khi có thể mượn thiết bị.";
        }

        // 7. Tạo đơn mượn
        const reqCode = await generateUniqueCode();
        const newRequest = await BorrowRequest.create({
            code:               reqCode,
            borrowerId:         user_id,
            borrowerRole:       'student',
            equipmentId:        equipment._id,
            roomId,
            scheduleId:         session._id,
            classSlotId:        session.slotId?._id || session.slotId,
            borrowDate:         now,
            expectedReturnDate: new Date(session.endAt),
            purpose:            purpose || null,
            note:               note    || null,
            status:             'pending',
        });

        console.log(`     - [AI] Tạo đơn mượn thành công: ${newRequest.code}`);

        return JSON.stringify({
            status:          'success',
            message:         `Đã tạo đơn mượn thành công cho thiết bị "${equipment.name}". Đơn đang chờ giảng viên xét duyệt.`,
            request_code:    newRequest.code,
            equipment_name:  equipment.name,
            room:            equipment.roomId?.name || null,
            slot:            session.slotId?.name   || null,
            expected_return: formatVNDate(session.endAt),
        });

    } catch (error) {
        console.error('Lỗi logic create_borrow_request:', error.message);
        return `Lỗi hệ thống: ${error.message}`;
    }
}

/**
 * Xem danh sách đơn mượn của người dùng hiện tại kèm trạng thái chi tiết.
 */
export async function get_my_borrow_requests(args) {
    try {
        const { user_id } = args;
        if (!user_id) return "Thiếu ID người dùng.";

        const requests = await BorrowRequest.find({ borrowerId: user_id })
            .populate('equipmentId', 'name code category')
            .populate('roomId',      'name')
            .populate('scheduleId',  'title date startAt endAt')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        if (requests.length === 0) {
            return JSON.stringify({ empty: true, message: "Bạn chưa có đơn mượn nào." });
        }

        const result = requests.map(req => ({
            code:           req.code,
            statusLabel:    STATUS_LABEL[req.status]  || req.status,
            actionNote:     STATUS_ACTION[req.status]  || '',
            equipment:      req.equipmentId?.name      || 'Không rõ',
            equipmentCode:  req.equipmentId?.code      || null,
            room:           req.roomId?.name           || null,
            borrowDate:     formatVNDate(req.borrowDate),
            expectedReturn: formatVNDate(req.expectedReturnDate),
            actualReturn:   formatVNDate(req.actualReturnDate),
            purpose:        req.purpose                || null,
            decisionNote:   req.decisionNote           || null,
        }));

        return JSON.stringify(result);
    } catch (error) {
        console.error('get_my_borrow_requests logic error:', error.message);
        return `Lỗi hệ thống: ${error.message}`;
    }
}
