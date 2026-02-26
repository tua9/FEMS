import Report from '../models/Report.js'

export const createReport = async (req, res) => {
  console.log('📃 Create report')

  try {
    const { user_id, equipment_id, room_id, type, description, img } = req.body
    console.log('req body: ', req.body)

    const report = await Report.create({
      user_id,
      equipment_id,
      room_id,
      type,
      description,
      img,
    })

    res.status(201).json({
      success: true,
      data: report,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}
