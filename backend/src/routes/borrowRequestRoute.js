import express from 'express'
import {
  createBorrowRequest,
  getAllBorrowRequests,
  getBorrowRequestById,
  getPersonalBorrowRequests,
  getPendingBorrowRequests,
  getApprovedByMe,
  cancelBorrowRequest,
  approveBorrowRequest,
  rejectBorrowRequest,
  directAllocateEquipment,
  handoverBorrowRequest,
  returnBorrowRequest,
  remindBorrowRequest,
} from '../controllers/borrowRequestController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

// ── Read ──────────────────────────────────────────────────────────────────────
router.get('/me', restrictTo('student', 'lecturer', 'technician', 'admin'), getPersonalBorrowRequests)
router.get('/approved-by-me', restrictTo('lecturer', 'technician', 'admin'), getApprovedByMe)
router.get('/pending', restrictTo('lecturer', 'technician', 'admin'), getPendingBorrowRequests)
router.get('/', restrictTo('technician', 'lecturer', 'admin'), getAllBorrowRequests)
router.get('/:id', restrictTo('student', 'technician', 'lecturer', 'admin'), getBorrowRequestById)

// ── Create ────────────────────────────────────────────────────────────────────
router.post('/', restrictTo('student', 'lecturer'), createBorrowRequest)
router.post('/direct-allocation', restrictTo('technician', 'admin'), directAllocateEquipment)

// ── Workflow actions ──────────────────────────────────────────────────────────
router.patch('/:id/cancel', restrictTo('student', 'lecturer', 'technician', 'admin'), cancelBorrowRequest)
router.patch('/:id/approve', restrictTo('lecturer', 'technician', 'admin'), approveBorrowRequest)
router.patch('/:id/reject', restrictTo('lecturer', 'technician', 'admin'), rejectBorrowRequest)
router.patch('/:id/handover', restrictTo('lecturer', 'technician', 'admin'), handoverBorrowRequest)
router.patch('/:id/return', restrictTo('student', 'lecturer', 'technician', 'admin'), returnBorrowRequest)
router.post('/:id/remind', restrictTo('lecturer', 'technician', 'admin'), remindBorrowRequest)

export default router
