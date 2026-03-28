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
  confirmReceivedBorrowRequest,
  submitReturnBorrowRequest,
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

// Student confirms they received the equipment (fills checklist + images). Status: approved → handed_over.
router.patch('/:id/confirm-received', restrictTo('student', 'lecturer'), confirmReceivedBorrowRequest)

// Student requests return (no form). Status: handed_over → returning.
router.patch('/:id/submit-return', restrictTo('student', 'lecturer'), submitReturnBorrowRequest)

// Lecturer/Admin confirms return after inspection. Status: returning → returned.
router.patch('/:id/return', restrictTo('lecturer', 'technician', 'admin'), returnBorrowRequest)

router.post('/:id/remind', restrictTo('lecturer', 'technician', 'admin'), remindBorrowRequest)

export default router
