import BorrowRequest from "../../models/BorrowRequest.js";
import Equipment from "../../models/Equipment.js";
import mongoose from "mongoose";

/**
 * Tạo bản ghi mượn thiết bị mới
 */
export async function create_borrow_request(args) {
    try {
        const { user_id, code, reason, borrow_date, return_date } = args;
        const todayStr = new Date().toISOString().split('T')[0];

        // 1. Kiểm tra thiếu trường bắt buộc
        const finalBorrowDate = borrow_date || todayStr;
        const finalReason = reason || "để học";

        if (!user_id || !code || !return_date) {
            return "Lỗi: Vui lòng cung cấp đủ thông tin (Mã thiết bị, ngày trả).";
        }

        // 2. Tìm thiết bị Bằng Mã
        const equipment = await Equipment.findOne({ code: code });

        if (!equipment) {
            return `Lỗi: Không tìm thấy thiết bị khớp với Mã "${code}".`;
        }

        // 3. Kiểm tra tình trạng thiết bị
        if (!equipment.available) {
            return `Rất tiếc, thiết bị "${equipment.name}" (Mã: ${equipment.code}) hiện đang có người khác mượn hoặc đang bảo trì.`;
        }

        // 5. Tạo bản ghi BorrowRequest
        const newRequest = new BorrowRequest({
            user_id: user_id,
            equipment_id: equipment._id,
            borrow_date: new Date(finalBorrowDate),
            return_date: new Date(return_date),
            note: finalReason,
            type: 'equipment',
            status: 'pending' // Chờ duyệt
        });

        // 6. Cập nhật tình trạng thiết bị (Middleware sẽ tự set available = false)

        // Lưu song song
        await Promise.all([
            equipment.save(),
            newRequest.save()
        ]);

        console.log(`     - [OK] Tạo thành công request mượn: ${newRequest._id}`);

        return JSON.stringify({
            status: "success",
            message: `Yêu cầu mượn thiết bị "${equipment.name}" đã được hệ thống ghi nhận thành công và đang chờ xét duyệt.`,
            request_id: newRequest._id
        });

    } catch (error) {
        console.error('Lỗi logic create_borrow_request:', error.message);
        return `Lỗi hệ thống: ${error.message}`;
    }
}