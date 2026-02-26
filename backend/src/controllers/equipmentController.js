import Equipment from '../models/Equipment.js'

export const createEquipment = async (req, res) => {
  console.log('💻 create equipment')

  try {
    const { name, category, available, status, room_id, qr_code } = req.body

    if (!name) {
      return res.status(400).json({
        message: 'Name is require',
      })
    }

    const newEquipment = await Equipment.create({
      name,
      category,
      available,
      status,
      room_id,
      qr_code,
    })

    return res.status(201).json({
      message: 'Create equipment success',
      equipment_id: newEquipment._id,
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    })
  }
}
