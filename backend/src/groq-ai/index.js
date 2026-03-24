import { groq, AI_CONFIG } from "./config.js";
import { tools } from "./tools.js";
import { get_equipment_detail, get_equipment_list, get_my_equipment } from "./tools/equipment-tool.js";
import { create_borrow_request } from "./tools/borrowRequest-tool.js";

/**
 * Điều phối gọi các tool dựa trên phản hồi của AI
 */
async function callTool(toolCall, user) {
    const { name: functionName, arguments: argsString } = toolCall.function;
    const args = JSON.parse(argsString || "{}"); // Bảo mật nếu argsString trống

    console.log(`     + Thực thi [${functionName}]:`, args || "(Không có tham số)");

    const toolArgs = args || {}; // Luôn đảm bảo là một object

    switch (functionName) {
        case "get_equipment_list":
            return await get_equipment_list(toolArgs);
        case "get_equipment_detail":
            return await get_equipment_detail(toolArgs);
        case "get_my_equipment":
            return await get_my_equipment({ ...toolArgs, user_id: user._id });
        case "create_borrow_request":
            return await create_borrow_request({ ...toolArgs, user_id: user._id });
        default:
            throw new Error(`Công cụ [${functionName}] không tồn tại.`);
    }
}

/**
 * Hàm thực thi Agent chính (Llama 3.1)
 * logic: Gửi tin nhắn -> nhận phản hồi -> gọi tool nếu cần -> lặp lại tối đa 5 lần -> trả kết quả cuối cùng.
 */
async function runAgent(user, prompt, history = []) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const tomorrowDate = new Date(); tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrow = tomorrowDate.toISOString().split('T')[0];

        // 1. Chuẩn bị ngữ cảnh hội thoại (Incorporate history if provided)
        const messages = [
            {
                role: "system",
                content: `
                # VAI TRÒ
                Bạn là Trợ lý Quản lý Thiết bị (FEMS AI). Chỉ sử dụng công cụ được cung cấp để hỗ trợ người dùng.
                Ngày hiện tại: ${today} (Dùng định dạng YYYY-MM-DD cho các tool).

                # THÔNG TIN NGƯỜI DÙNG
                - Tên: ${user.name || user.displayName} (ID: ${user._id})

                # QUY TẮC SỬ DỤNG CÔNG CỤ
                - Hỏi danh sách -> gọi 'get_equipment_list'.
                - Hỏi chi tiết một máy -> gọi 'get_equipment_detail' (chỉ dùng 'code').
                - Xem lịch sử -> gọi 'get_my_equipment'.

                # QUY TRÌNH MƯỢN MÁY (BẮT BUỘC TUÂN THỦ 2 BƯỚC)
                Tuyệt đối KHÔNG gọi tool 'create_borrow_request' ngay khi người dùng nói muốn mượn. BẠN PHẢI LÀM ĐÚNG 2 BƯỚC:
                - BƯỚC 1 (TẠO BẢN NHÁP VÀ CHỜ): Viết ra thông tin mượn chuẩn bị gửi đi (vd: "Mã thiết bị: ..., Ngày mượn: ${today}, Ngày trả: ${tomorrow}, Lý do: để học"). Dưới danh sách này, bạn PHẢI HỎI: "Bạn có đồng ý tạo đơn mượn với thông tin này không?". TỚI ĐÂY DỪNG LẠI (Không gọi tool mượn).
                - BƯỚC 2 (THỰC THI TOOL): Mãi đến khi vòng chat tiếp theo, khi người dùng nói rõ "Đồng ý", "Xác nhận", "Tạo đi"... CHỈ LÚC ĐÓ bạn mới gởi thông tin vào tool 'create_borrow_request'.

                # QUY TẮC CỐT LÕI
                1. LUÔN LUÔN DỪNG VÀ TRẢ LỜI NGƯỜI DÙNG ngay sau khi nhận được JSON kết quả từ 1 tool bất kì (như list, hoặc chi tiết). KHÔNG gọi liên tiếp nhiều tool một cách vô tội vạ.
                2. BẢO MẬT: Báo cáo kết quả bằng tiếng Việt tự nhiên và KHÔNG trả ra chuỗi _id.
                `
            },
            // Sanitize history: chỉ giữ 'role' & 'content', loại bỏ các trường frontend-only (như isError)
            // Chỉ giữ 4 tin nhắn gần nhất để giảm token & tăng tốc phản hồi
            ...history.slice(-4).map(({ role, content }) => ({ role, content })),
            { role: "user", content: prompt }
        ];

        console.log(`\n--- [CHAT SESSION START] ---`);
        console.log(`User  : ${user.name || user.displayName}`);
        console.log(`Prompt: "${prompt}"`);

        // 2. Vòng lặp Agent Step (Max 5 turns)
        for (let i = 0; i < AI_CONFIG.MAX_ITERATIONS; i++) {
            const response = await groq.chat.completions.create({
                model: AI_CONFIG.MODEL_ID,
                messages,
                tools,
                tool_choice: "auto",
                temperature: AI_CONFIG.TEMPERATURE,
            });

            const aiResponse = response.choices[0].message;
            messages.push(aiResponse);

            // Nếu AI không gọi tool nữa -> hoàn tất và trả về text
            if (!aiResponse.tool_calls || aiResponse.tool_calls.length === 0) {
                console.log(`--- [CHAT SESSION END] ---\n`);
                return aiResponse.content;
            }

            console.log(`---> [Turn ${i + 1}] yêu cầu gọi ${aiResponse.tool_calls.length} tool(s)`);

            // Thực thi toàn bộ tool calls trong turn này
            const toolResults = await Promise.all(
                aiResponse.tool_calls.map(async (tc) => {
                    try {
                        const result = await callTool(tc, user);
                        return {
                            tool_call_id: tc.id,
                            role: "tool",
                            name: tc.function.name,
                            content: String(result),
                        };
                    } catch (err) {
                        return {
                            tool_call_id: tc.id,
                            role: "tool",
                            name: tc.function.name,
                            content: `Lỗi: ${err.message}`,
                        };
                    }
                })
            );

            // Gửi kết quả tool lại cho AI
            messages.push(...toolResults);
        }

        return "Xin lỗi, yêu cầu của bạn quá phức tạp để xử lý ngay. Vui lòng cung cấp thêm thông tin nhé.";

    } catch (error) {
        console.error('Lỗi thực thi runAgent:', error.message);
        return "Xin lỗi, hiện tại hệ thống AI đang gặp sự cố. Bạn vui lòng thử lại sau.";
    }
}

export default runAgent;