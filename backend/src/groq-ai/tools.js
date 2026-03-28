/**
 * Định nghĩa danh sách công cụ (Tools) cho Agent
 */
export const tools = [
    {
        type: "function",
        function: {
            name: "get_equipment_list",
            description: "Xem danh sách thiết bị mà sinh viên CÓ THỂ MƯỢN ngay lúc này (chỉ trong phòng có ca học đang chạy và GV đã điểm danh). Trả về empty+reason nếu không đủ điều kiện.",
            parameters: {
                type: "object",
                properties: {
                    type:   { type: "string", description: "Loại/danh mục thiết bị để lọc (ví dụ: 'Laptop', 'Máy chiếu')" },
                    search: { type: "string", description: "Từ khóa tìm kiếm theo tên thiết bị" },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_equipment_detail",
            description: "Tra cứu thông tin chi tiết và trạng thái mượn của một thiết bị. BẮT BUỘC truyền mã thiết bị (code).",
            parameters: {
                type: "object",
                properties: {
                    code: {
                        type: "string",
                        description: "Mã thiết bị, ví dụ: LA2603JZN. Gọi get_equipment_list trước nếu chưa biết mã.",
                    },
                },
                required: ["code"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "create_borrow_request",
            description: "Tạo đơn mượn thiết bị. Chỉ gọi khi người dùng ĐÃ XÁC NHẬN đồng ý VÀ bạn đã có MÃ THIẾT BỊ chính xác (code). Nếu người dùng chỉ nói tên máy, hãy gọi get_equipment_list để tìm mã trước.",
            parameters: {
                type: "object",
                properties: {
                    code:    { type: "string", description: "BẮT BUỘC: Mã thiết bị, ví dụ: 'LA2603JZN'." },
                    purpose: { type: "string", description: "Mục đích mượn (tùy chọn)" },
                    note:    { type: "string", description: "Ghi chú thêm (tùy chọn)" },
                },
                required: ["code"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_my_borrow_requests",
            description: "Xem danh sách đơn mượn thiết bị của người dùng hiện tại, kèm trạng thái (chờ duyệt, đang mượn, đã trả...) và thông tin thiết bị.",
            parameters: {
                type: "object",
                properties: {},
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_my_schedule_today",
            description: "Xem lịch học hôm nay của sinh viên. Trả về từng ca: tên môn, phòng, giờ bắt đầu/kết thúc, trạng thái ca (đang chạy/sắp tới/đã qua), GV đã điểm danh chưa, có thể mượn thiết bị không.",
            parameters: {
                type: "object",
                properties: {},
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_next_borrowable_time",
            description: "Tìm ca học tiếp theo mà sinh viên có thể mượn thiết bị. Dùng khi sinh viên hỏi 'bao giờ tôi mượn được?', 'tại sao tôi không mượn được?', 'ca học tiếp theo của tôi là khi nào?'.",
            parameters: {
                type: "object",
                properties: {},
            },
        },
    },
];
