/**
 * Pushes items with 'available' status to the top of the list.
 */
export const sortEquipmentByAvailability = (items)=> {
 return [...items].sort((a, b) => {
 const aIsAvailable = a.status === "available" && !a.borrowed_by;
 const bIsAvailable = b.status === "available" && !b.borrowed_by;

 if (aIsAvailable && !bIsAvailable) return -1;
 if (!aIsAvailable && bIsAvailable) return 1;
 return 0; // Maintain original sorting for others
 });
};

/**
 * Checks if the user has an active borrow request for the given equipment.
 */
export const hasActiveBorrowRequest = (
 equipmentId, myRequests) => {
 const activeStatuses = ["pending", "approved", "handed_over"];

 return myRequests.find((req) => {
 const reqEqId = typeof req.equipmentId === "object" ? (req.equipmentId)?._id : req.equipmentId;
 return reqEqId === equipmentId && activeStatuses.includes(req.status);
 });
};

/**
 * Suy ra loại thiết bị dựa vào category và room_id
 * - Type 3 (Hạ tầng): Các danh mục không mượn được (điều hòa, quạt...)
 * - Type 1 (Cố định): Thiết bị có phòng cố định
 * - Type 2 (Di động): Thiết bị kho không có phòng cố định
 */
export const getDerivedEquipmentType = (equipment) => {
 if (!equipment) return 'Warehouse';

 const infraCategories = ['air_conditioner', 'fan', 'tv', 'furniture', 'door'];
 const cat = equipment.category?.toLowerCase() || '';

 if (infraCategories.includes(cat)) {
 return 'Infrastructure';
 }

 if (equipment.roomId || equipment.room_id) {
 return 'Lab';
 }

 return 'Warehouse';
};

/**
 * Suy ra trạng thái ảo (Virtual Status) của thiết bị
 * Phớt lờ cờ available: boolean ở backend do nó bị ảnh hưởng bởi pre('save') hook cho phòng.
 * Dùng tổ hợp [status] + [borrowed_by] + [BorrowRequest status].
 */
export const getDerivedStatus = (
 equipment,
 activeRequests= []
) => {
 if (!equipment) return 'Available';

 if (equipment.status === 'broken') return 'Broken';
 if (equipment.status === 'maintenance') return 'Maintenance';

 return 'Available';
};
