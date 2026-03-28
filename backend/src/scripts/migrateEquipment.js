/**
 * migrateEquipment.js
 * Cleans up old business-state fields from the equipment collection and
 * renames snake_case fields to camelCase.
 *
 * Changes applied:
 *   room_id         → roomId
 *   serial_number   → serialNumber
 *   purchase_date   → purchaseDate
 *   last_maintenance_date → lastMaintenanceDate
 *
 * Fields REMOVED (business state — now derived from BorrowRequest):
 *   available
 *   borrowed_by
 *
 * Status enum cleanup:
 *   'reserved' → 'good'   (was set when a request was approved — no longer stored here)
 *   'in_use'   → 'good'   (actual usage tracked via BorrowRequest.status='handed_over')
 *
 * Usage:
 *   node src/scripts/migrateEquipment.js
 *
 * IDEMPOTENT — skips documents that already have roomId.
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const db = mongoose.connection.db
  const col = db.collection('equipment')

  const cursor = col.find({ room_id: { $exists: true } })
  let migrated = 0
  let skipped = 0

  while (await cursor.hasNext()) {
    const doc = await cursor.next()

    if (doc.roomId) {
      skipped++
      continue
    }

    // Map old status values to new enum
    let status = doc.status || 'good'
    if (status === 'reserved' || status === 'in_use') {
      status = 'good'
    }

    const $set = {
      roomId: doc.room_id,
      serialNumber: doc.serial_number ?? '',
      purchaseDate: doc.purchase_date ?? null,
      lastMaintenanceDate: doc.last_maintenance_date ?? null,
      status,
    }

    const $unset = {
      room_id: '',
      serial_number: '',
      purchase_date: '',
      last_maintenance_date: '',
      available: '',
      borrowed_by: '',
    }

    await col.updateOne({ _id: doc._id }, { $set, $unset })
    migrated++

    if (migrated % 50 === 0) {
      console.log(`  Migrated ${migrated} documents…`)
    }
  }

  console.log(`\nDone. Migrated: ${migrated}, Skipped (already done): ${skipped}`)
  await mongoose.disconnect()
}

run().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
