import express from 'express'
import {
  createBorrowRequest,
  getAllBorrowRequests,
  getBorrowRequestById,
  updateBorrowRequest,
  getPersonalBorrowRequests,
  cancelBorrowRequest,
  approveBorrowRequest,
  handoverBorrowRequest,
  returnBorrowRequest,
} from '../controllers/borrowRequestController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

router.get(
  '/me',
  restrictTo('student', 'lecturer', 'tech', 'admin'),
  getPersonalBorrowRequests,
)
router.post(
  '/',
  restrictTo('student', 'lecturer', 'tech', 'admin'),
  createBorrowRequest,
) // Student specific
router.delete(
  '/:id',
  restrictTo('student', 'lecturer', 'tech', 'admin'),
  cancelBorrowRequest,
)

router.patch(
  '/:id/approve',
  restrictTo('lecturer', 'tech', 'admin'),
  approveBorrowRequest,
)
router.patch(
  '/:id/handover',
  restrictTo('lecturer', 'tech', 'admin'),
  handoverBorrowRequest,
)
router.patch(
  '/:id/return',
  restrictTo('lecturer', 'tech', 'admin'),
  returnBorrowRequest,
)

router.get('/', restrictTo('lecturer', 'tech', 'admin'), getAllBorrowRequests)
router.get('/:id', restrictTo('lecturer', 'tech', 'admin'), getBorrowRequestById)
router.patch(
  '/:id',
  restrictTo('lecturer', 'tech', 'admin'),
  updateBorrowRequest,
)

export default router
