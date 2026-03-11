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
  restrictTo('student', 'Teacher', 'Tech', 'Admin'),
  getPersonalBorrowRequests,
)
router.post(
  '/',
  restrictTo('student', 'Teacher', 'Tech', 'Admin'),
  createBorrowRequest,
) // Student specific
router.delete(
  '/:id',
  restrictTo('Student', 'Teacher', 'Tech', 'Admin'),
  cancelBorrowRequest,
)

router.patch(
  '/:id/approve',
  restrictTo('Teacher', 'Tech', 'Admin'),
  approveBorrowRequest,
)
router.patch(
  '/:id/handover',
  restrictTo('Tech', 'Student', 'Admin'),
  handoverBorrowRequest,
)
router.patch(
  '/:id/return',
  restrictTo('Student', 'Tech', 'Admin'),
  returnBorrowRequest,
)

router.get('/', restrictTo('Tech', 'Teacher', 'Admin'), getAllBorrowRequests)
router.get('/:id', restrictTo('Tech', 'Teacher', 'Admin'), getBorrowRequestById)
router.patch(
  '/:id',
  restrictTo('Tech', 'Teacher', 'Admin'),
  updateBorrowRequest,
)

export default router
