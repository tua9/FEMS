import Equipment from '../models/Equipment.js';

// Tạo thiết bị mới
export const createEquipmentService = async ({ name, category, status, room_id, borrowed_by, qr_code }) => {
  console.log('Creating equipment with data:', { name, category, status, room_id, borrowed_by, qr_code });
  try {
    const newEquipment = new Equipment({
      name,
      category,
      status,
      room_id,
      borrowed_by,
      qr_code,
    });

   await newEquipment.save();
    return newEquipment;
  } catch (error) {
    throw new Error('Error creating equipment');
  }
};

// Cập nhật thiết bị
export const updateEquipmentService = async (id, { name, category, status, room_id, borrowed_by, qr_code }) => {
  try {
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return null; // Không tìm thấy thiết bị
    }

    equipment.name = name || equipment.name;
    equipment.category = category || equipment.category;
    equipment.status = status || equipment.status;
    equipment.room_id = room_id || equipment.room_id;
    equipment.borrowed_by = borrowed_by || equipment.borrowed_by;
    equipment.qr_code = qr_code || equipment.qr_code;

    await equipment.save();
    return equipment;
  } catch (error) {
    throw new Error('Error updating equipment');
  }
};

// Xóa thiết bị
export const deleteEquipmentService = async (id) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(id);
    return equipment; // Nếu xóa thành công, trả về thiết bị đã xóa
  } catch (error) {
    throw new Error('Error deleting equipment');
  }
};

// Lấy tất cả thiết bị
export const getAllEquipmentService = async () => {
  try {
    const equipmentList = await Equipment.find().populate('room_id borrowed_by');
    return equipmentList;
  } catch (error) {
    throw new Error('Error fetching equipment');
  }
};