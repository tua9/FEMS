import { groq, AI_CONFIG } from "./config.js";
import { tools } from "./tools.js";
import { get_equipment_detail, get_equipment_list } from "./tools/equipment-tool.js";
import { create_borrow_request, get_my_borrow_requests } from "./tools/borrowRequest-tool.js";
import { get_my_schedule_today, get_next_borrowable_time } from "./tools/schedule-tool.js";

/**
 * Điều phối gọi các tool dựa trên phản hồi của AI
 */
async function callTool(toolCall, user) {
    const { name: functionName, arguments: argsString } = toolCall.function;
    const args = JSON.parse(argsString || "{}");

    console.log(`     + Thực thi [${functionName}]:`, args || "(Không có tham số)");

    switch (functionName) {
        case "get_equipment_list":
            return await get_equipment_list({ ...args, user_id: user._id });
        case "get_equipment_detail":
            return await get_equipment_detail(args);
        case "get_my_borrow_requests":
            return await get_my_borrow_requests({ user_id: user._id });
        case "create_borrow_request":
            return await create_borrow_request({ ...args, user_id: user._id });
        case "get_my_schedule_today":
            return await get_my_schedule_today({ user_id: user._id });
        case "get_next_borrowable_time":
            return await get_next_borrowable_time({ user_id: user._id });
        default:
            throw new Error(`Công cụ [${functionName}] không tồn tại.`);
    }
}

/**
 * Hàm thực thi Agent chính (Llama 3.1)
 */
async function runAgent(user, prompt, history = []) {
    try {
        const messages = [
            {
                role: "system",
                content: `
# VAI TRÒ
Bạn là Trợ lý Quản lý Thiết bị (FEMS AI). Hỗ trợ sinh viên tra cứu thiết bị, xem lịch học và tạo đơn mượn. Chỉ sử dụng các công cụ được cung cấp.

# THÔNG TIN NGƯỜI DÙNG
- Tên: ${user.name || user.displayName} (vai trò: sinh viên)

# HƯỚNG DẪN SỬ DỤNG CÔNG CỤ
- Hỏi thiết bị có thể mượn → gọi 'get_equipment_list'
- Hỏi chi tiết một thiết bị → gọi 'get_equipment_detail' (chỉ dùng 'code')
- Xem đơn mượn / lịch sử → gọi 'get_my_borrow_requests'
- Hỏi lịch học hôm nay → gọi 'get_my_schedule_today'
- Hỏi "bao giờ mượn được" / "tại sao không mượn được" → gọi 'get_next_borrowable_time'

# XỬ LÝ KẾT QUẢ TOOL (QUAN TRỌNG)
Khi tool trả về JSON có field 'empty: true', hãy đọc 'reason' và giải thích thân thiện:
- 'has_unreturned'       → Báo có thiết bị chưa hoàn trả, cần trả trước
- 'has_pending_request'  → Báo đã có đơn đang chờ duyệt
- 'no_session'           → Báo không có ca học đang diễn ra, gợi ý gọi 'get_next_borrowable_time'
- 'teacher_not_checked_in' → Báo GV chưa điểm danh, nhắc sinh viên chờ
- 'no_class'             → Báo chưa có lớp học
- 'no_equipment'         → Báo không còn thiết bị trống trong phòng

# QUY TRÌNH MƯỢN THIẾT BỊ (BẮT BUỘC 2 BƯỚC)
Tuyệt đối KHÔNG gọi 'create_borrow_request' ngay. PHẢI LÀM ĐÚNG 2 BƯỚC:

BƯỚC 1 – HIỂN THỊ THÔNG TIN VÀ CHỜ XÁC NHẬN:
Viết ra bản nháp đơn mượn: tên thiết bị, mã, phòng, mục đích (nếu có).
Kết thúc bằng: "Bạn có xác nhận tạo đơn mượn với thông tin này không?"
→ DỪNG LẠI.

BƯỚC 2 – TẠO ĐƠN (chỉ khi được xác nhận):
Khi người dùng nói "Đồng ý", "Xác nhận", "Tạo đi"... CHỈ LÚC ĐÓ mới gọi 'create_borrow_request'.

# QUY TẮC CỐT LÕI
1. Luôn DỪNG và trả lời sau mỗi tool. KHÔNG gọi liên tiếp nhiều tool.
2. Trả lời bằng tiếng Việt tự nhiên. KHÔNG hiển thị _id.
3. Dịch statusLabel ra tiếng Việt khi hiển thị trạng thái đơn mượn.
                `,
            },
            ...history.slice(-4).map(({ role, content }) => ({ role, content })),
            { role: "user", content: prompt },
        ];

        console.log(`\n--- [CHAT SESSION START] ---`);
        console.log(`User  : ${user.name || user.displayName}`);
        console.log(`Prompt: "${prompt}"`);

        for (let i = 0; i < AI_CONFIG.MAX_ITERATIONS; i++) {
            const response = await groq.chat.completions.create({
                model:       AI_CONFIG.MODEL_ID,
                messages,
                tools,
                tool_choice: "auto",
                temperature: AI_CONFIG.TEMPERATURE,
            });

            const aiResponse = response.choices[0].message;
            messages.push(aiResponse);

            if (!aiResponse.tool_calls || aiResponse.tool_calls.length === 0) {
                console.log(`--- [CHAT SESSION END] ---\n`);
                return aiResponse.content;
            }

            console.log(`---> [Turn ${i + 1}] yêu cầu gọi ${aiResponse.tool_calls.length} tool(s)`);

            const toolResults = await Promise.all(
                aiResponse.tool_calls.map(async (tc) => {
                    try {
                        const result = await callTool(tc, user);
                        return {
                            tool_call_id: tc.id,
                            role:         "tool",
                            name:         tc.function.name,
                            content:      String(result),
                        };
                    } catch (err) {
                        return {
                            tool_call_id: tc.id,
                            role:         "tool",
                            name:         tc.function.name,
                            content:      `Lỗi: ${err.message}`,
                        };
                    }
                })
            );

            messages.push(...toolResults);
        }

        return "Xin lỗi, yêu cầu của bạn quá phức tạp để xử lý ngay. Vui lòng cung cấp thêm thông tin nhé.";

    } catch (error) {
        console.error('Lỗi thực thi runAgent:', error.message);
        return "Xin lỗi, hiện tại hệ thống AI đang gặp sự cố. Bạn vui lòng thử lại sau.";
    }
}

export default runAgent;
