/**
 * seedSlots.js
 * Populates the Slot collection with standard time-slot definitions.
 *
 * Usage:
 *   node src/scripts/seedSlots.js
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Slot from '../models/Slot.js'

dotenv.config()

const SLOTS = [
  { code: 'SLOT_1', name: 'Ca 1', startTime: '07:00', endTime: '09:30', order: 1 },
  { code: 'SLOT_2', name: 'Ca 2', startTime: '09:45', endTime: '12:15', order: 2 },
  { code: 'SLOT_3', name: 'Ca 3', startTime: '13:00', endTime: '15:30', order: 3 },
  { code: 'SLOT_4', name: 'Ca 4', startTime: '15:45', endTime: '18:15', order: 4 },
  { code: 'SLOT_5', name: 'Ca 5', startTime: '18:30', endTime: '21:00', order: 5 },
]

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  let created = 0
  let skipped = 0

  for (const slot of SLOTS) {
    const existing = await Slot.findOne({ code: slot.code })
    if (existing) {
      console.log(`  SKIP  ${slot.code} (already exists)`)
      skipped++
      continue
    }
    await Slot.create({ ...slot, isActive: true })
    console.log(`  CREATE ${slot.code} — ${slot.name} (${slot.startTime}–${slot.endTime})`)
    created++
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`)
  await mongoose.disconnect()
}

run().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
