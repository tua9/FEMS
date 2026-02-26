import BorrowRequest from '../models/BorrowRequest.js'
import User from '../models/User.js' // giả sử bạn có model User
import Equipment from '../models/Equipment.js' // nếu có model Equipment
import Room from '../models/Room.js' // nếu có model Room

export const createBorrowRequest = async (req, res) => {
  console.log('📕 create borrow request')

  try {
    const {
      user_id,
      equipment_id,
      room_id,
      type,
      borrow_date,
      return_date,
      note,
    } = req.body

    // 1. Kiểm tra bắt buộc phải có user_id
    if (!user_id) {
      return res.status(422).json({
        message: 'user_id is required',
      })
    }

    // 2. Phải chọn đúng một trong hai: equipment_id hoặc room_id và phải đúng với tpye
    if ((equipment_id && room_id) || (!equipment_id && !room_id)) {
      return res.status(422).json({
        message:
          'Must provide either equipment_id or room_id (not both, not neither)',
      })
    }

    if (
      (type === 'infrastructer' && !room_id) ||
      (type === 'equipment' && !equipment_id)
    ) {
      return res.status(422).json({
        message: 'Type or id is not correct',
      })
    }

    // 3. Kiểm tra tồn tại thực tế trong database
    // Kiểm tra user
    const user = await User.findById(user_id).select('_id').lean()
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    // Kiểm tra equipment nếu có
    if (equipment_id) {
      const equipment = await Equipment.findById(equipment_id)
        .select('_id')
        .lean()
      if (!equipment) {
        return res.status(404).json({
          message: 'Equipment not found',
        })
      }
    }

    // Kiểm tra room nếu có
    if (room_id) {
      const room = await Room.findById(room_id).select('_id').lean()
      if (!room) {
        return res.status(404).json({
          message: 'Room not found',
        })
      }
    }

    // 4. Xử lý thời gian
    const now = new Date()
    const borrowDate = new Date(borrow_date)
    const returnDate = new Date(return_date)

    if (borrowDate >= returnDate) {
      return res.status(422).json({
        message: 'Borrow date must be before return date',
      })
    }

    if (borrowDate < now) {
      return res.status(422).json({
        message: 'Borrow date cannot be in the past',
      })
    }

    // 5. Tạo request
    const newBorrowRequest = await BorrowRequest.create({
      user_id,
      equipment_id: equipment_id || null,
      room_id: room_id || null,
      type: type || 'other', // fallback nếu không gửi type
      borrow_date: borrowDate,
      return_date: returnDate,
      note,
    })

    return res.status(201).json({
      message: 'Create borrow request success',
      borrowRequest: {
        id: newBorrowRequest._id,
        user_id: newBorrowRequest.user_id,
        equipment_id: newBorrowRequest.equipment_id,
        room_id: newBorrowRequest.room_id,
        borrow_date: newBorrowRequest.borrow_date,
        return_date: newBorrowRequest.return_date,
        status: newBorrowRequest.status,
      },
    })
  } catch (err) {
    console.error('Create borrow request error:', err)

    // Phân loại lỗi Mongoose validation nếu có
    if (err.name === 'ValidationError') {
      return res.status(422).json({
        message: 'Validation failed',
        errors: Object.values(err.errors).map((e) => e.message),
      })
    }

    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    })
  }
}
