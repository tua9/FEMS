import express from 'express'
import {
  createBorrowRequest,
  getAllBorrowRequests,
  getBorrowRequestById,
  updateBorrowRequest,
  getPersonalBorrowRequests,
  cancelBorrowRequest,
  approveBorrowRequest,
  rejectBorrowRequest,
  directAllocateEquipment,
  handoverBorrowRequest,
  returnBorrowRequest,
  remindBorrowRequest,
  getPendingBorrowRequests,
  getApprovedByMe,
  editBorrowRequest,
} from '../controllers/borrowRequestController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

console.log('✅ [ROUTE LOAD] Borrow Request Route Loaded')

const router = express.Router()

router.use(protectedRoute)

router.get(
  '/me',
  restrictTo('student', 'lecturer', 'technician', 'admin'),
  getPersonalBorrowRequests,
)

router.get(
  '/approved-by-me',
  restrictTo('lecturer', 'technician', 'admin'),
  getApprovedByMe,
)

router.get(
  '/pending',
  restrictTo('lecturer', 'technician', 'admin'),
  getPendingBorrowRequests,
)

router.post(
  '/',
  restrictTo('student', 'lecturer', 'technician', 'admin'),
  createBorrowRequest,
) // Student specific

router.post(
  '/direct-allocation',
  restrictTo('technician', 'admin'),
  directAllocateEquipment,
)
router.patch(
  '/:id/cancel',
  restrictTo('student', 'lecturer', 'technician', 'admin'),
  cancelBorrowRequest,
)

router.patch(
  '/:id/edit',
  restrictTo('student', 'lecturer', 'technician', 'admin'),
  editBorrowRequest,
)

router.patch(
  '/:id/approve',
  restrictTo('lecturer', 'technician', 'admin'),
  approveBorrowRequest,
)

router.patch(
  '/:id/reject',
  restrictTo('lecturer', 'technician', 'admin'),
  rejectBorrowRequest,
)
router.patch(
  '/:id/handover',
  restrictTo('technician', 'student', 'admin'),
  handoverBorrowRequest,
)
router.patch(
  '/:id/return',
  restrictTo('student', 'technician', 'admin'),
  returnBorrowRequest,
)

router.post(
  '/:id/remind',
  restrictTo('lecturer', 'technician', 'admin'),
  remindBorrowRequest,
)

router.get('/', restrictTo('technician', 'lecturer', 'admin'), getAllBorrowRequests)
router.get('/:id', restrictTo('student', 'technician', 'lecturer', 'admin'), getBorrowRequestById)
router.patch(
  '/:id',
  restrictTo('technician', 'lecturer', 'admin'),
  updateBorrowRequest,
)

export default router
