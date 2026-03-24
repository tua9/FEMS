/**
 * Định nghĩa danh sách công cụ (Tools) cho Agent
 */
export const tools = [
    {
        type: "function",
        function: {
            name: "get_equipment_list",
            description: "Xem danh sách thiết bị. LƯU Ý: Nếu muốn xem tất cả máy đang rảnh, không cần truyền tham số gì cả.",
            parameters: {
                type: "object",
                properties: {
                    type: { type: "string", description: "Loại thiết bị để lọc (ví dụ: 'Laptop')" },
                    search: { type: "string", description: "Từ khóa tìm kiếm theo tên" }
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_equipment_detail",
            description: "Tra cứu thông tin chi tiết của thiết bị trước khi mượn. BẮT BUỘC TRUYỀN MÃ THIẾT BỊ (code), không truyền tên.",
            parameters: {
                type: "object",
                properties: {
                    code: { type: "string", description: "Mã thiết bị, ví dụ: IN2603KBD. Bạn có thể gọi tool 'get_equipment_list' để biết danh sách mã này trước." }
                },
                required: ["code"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "create_borrow_request",
            description: "Tạo yêu cầu mượn thiết bị mới dựa trên Mã thiết bị (code). Bước này CHỈ được gọi khi người dùng ĐÃ XÁC NHẬN ĐỒNG Ý việc mượn.",
            parameters: {
                type: "object",
                properties: {
                    code: {
                        type: "string",
                        description: "BẮT BUỘC: Mã thiết bị, ví dụ như 'LA2603JZN'."
                    },
                    reason: { type: "string", description: "Lý do mượn (Mặc định: 'để học hành')" },
                    borrow_date: { type: "string", description: "Ngày mượn (YYYY-MM-DD)" },
                    return_date: { type: "string", description: "Ngày dự kiến trả (YYYY-MM-DD)" },
                },
                required: ["code", "borrow_date", "return_date"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_my_equipment",
            description: "Xem danh sách các thiết bị mà chính tôi (người dùng hiện tại) đang mượn.",
            parameters: {
                type: "object",
                properties: {},
            },
        },
    },
];
