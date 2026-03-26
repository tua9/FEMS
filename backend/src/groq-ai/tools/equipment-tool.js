import Equipment from "../../models/Equipment.js";
import Room from "../../models/Room.js"; // Import Room model here to enable population

/**
 * Lấy danh sách thiết bị
 * - Nếu không có search, trả về 10 máy mới nhất.
 * - Ưu tiên trả về máy đang rảnh (available: true)
 */
export async function get_equipment_list(args = {}) {
    try {
        const { search, type } = args || {};
        const query = {};

        // Chỉ lọc available:true nếu là yêu cầu liệt kê chung chung
        if (!search && !type) {
            query.available = true;
        }

        if (search) query.name = { $regex: search, $options: 'i' };
        if (type) query.category = type;

        const list = await Equipment.find(query).populate('room_id', 'name').limit(20).lean();
        return JSON.stringify(list);
    } catch (error) {
        console.error('get_equipment_list logic error:', error.message);
        return `Lỗi hệ thống: ${error.message}`;
    }
}

/**
 * Lấy chi tiết MỘT thiết bị (Dùng để lấy _id)
 * - Ưu tiên tìm máy rảnh trước nếu tìm theo tên.
 */
export async function get_equipment_detail(args) {
    try {
        const { code } = args;
        if (!code) {
            return "Vui lòng cung cấp mã thiết bị (code).";
        }

        // TÌM KIẾM THEO CODE
        const deviceByCode = await Equipment.findOne({ code }).populate('room_id', 'name').lean();
        if (deviceByCode) return JSON.stringify(deviceByCode);

        return `Không tìm thấy thiết bị nào có mã "${code}".`;

    } catch (error) {
        console.error('get_equipment_detail logic error:', error.message);
        return `Lỗi hệ thống: ${error.message}`;
    }
}

/**
 * Lấy danh sách thiết bị mà người dùng HIỆN TẠI đang mượn
 */
export async function get_my_equipment(args) {
    try {
        const { user_id } = args;
        if (!user_id) return "Thiếu ID người dùng.";

        const list = await Equipment.find({ borrowed_by: user_id }).populate('room_id', 'name').lean();
        return JSON.stringify(list);
    } catch (error) {
        console.error('get_my_equipment logic error:', error.message);
        return `Lỗi hệ thống: ${error.message}`;
    }
}