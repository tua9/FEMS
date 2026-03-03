import express from 'express';
import {
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getAllEquipment
} from '../controllers/equipmentController.js';

const router = express.Router();

// API để tạo thiết bị
router.post('/', createEquipment);

// API để cập nhật thiết bị
router.put('/:id', updateEquipment);

// API để xóa thiết bị
router.delete('/:id', deleteEquipment);

// API để lấy tất cả thiết bị
router.get('/', getAllEquipment);

export default router;