import Building from '../models/Building.js'

export const createBuilding = async (req, res) => {
  console.log('🏢 create building')
  try {
    const { name, status } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' })
    }

    const isExistBuilding = await Building.findOne({ name })

    if (isExistBuilding) {
      return res.status(409).json({
        message: 'Building already exists',
      })
    }

    const newBuilding = await Building.create({
      name: name.trim(),
      status,
    })

    return res.status(201).json({
      message: 'Create building success',
      building_id: newBuilding._id,
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    })
  }
}
