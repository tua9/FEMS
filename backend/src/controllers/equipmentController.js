import Equipment from '../models/Equipment.js'; // Model thiết bị
import { createEquipmentService, updateEquipmentService, deleteEquipmentService, getAllEquipmentService } from '../services/equipmentService.js';

// Thêm thiết bị
export const createEquipment = async (req, res) => {
  console.log('createEquipment Request body:', req.body);
    try {
    const { name, category, status, room_id, borrowed_by, qr_code } = req.body;

    if (!name || !category || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Gọi service tạo thiết bị
    const result = await createEquipmentService({ name, category, status, room_id, borrowed_by, qr_code });
    return res.status(204).json(result);
  } catch (error) {
    console.error('Error creating equipment:', error);
    return res.status(500).json({ message: 'Error creating equipment' });
  }
};

// Cập nhật thiết bị
export const updateEquipment = async (req, res) => {
  const { id } = req.params;
  const { name, category, status, room_id, borrowed_by, qr_code } = req.body;

  try {
    // Gọi service cập nhật thiết bị
    const result = await updateEquipmentService(id, { name, category, status, room_id, borrowed_by, qr_code });

    if (!result) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error updating equipment:', error);
    return res.status(500).json({ message: 'Error updating equipment' });
  }
};

// Xóa thiết bị
export const deleteEquipment = async (req, res) => {
  const { id } = req.params;
  try {
    // Gọi service xóa thiết bị
    const result = await deleteEquipmentService(id);

    if (!result) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    return res.status(204).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return res.status(500).json({ message: 'Error deleting equipment' });
  }
};

// Lấy tất cả thiết bị
export const getAllEquipment = async (req, res) => {
  try {
    const result = await getAllEquipmentService();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return res.status(500).json({ message: 'Error fetching equipment' });
  }
};