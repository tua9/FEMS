import Room from '../models/Room.js'

export const createRoom = async (req, res) => {
  try {
    const { name, type, status, building_id } = req.body

    if (!name) {
      return res.status(400).json({
        message: 'Name is required',
      })
    }

    const isExistRoom = await Room.findOne({ name })

    if (isExistRoom) {
      return res.status(409).json({
        message: 'Room already exists',
      })
    }

    const newRoom = await Room.create({
      name,
      type,
      status,
      building_id,
    })

    return res.status(201).json({
      message: 'Create room success',
      room_id: newRoom._id,
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    })
  }
}
