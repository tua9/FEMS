/**
 * migrateBorrowRequests.js
 * Renames old snake_case fields to new camelCase fields in the borrowrequests collection.
 *
 * Field mapping:
 *   user_id         → borrowerId
 *   equipment_id    → equipmentId
 *   room_id         → roomId
 *   borrow_date     → borrowDate
 *   return_date     → expectedReturnDate
 *   decision_note   → decisionNote
 *   cancelled_at    → cancelledAt
 *   cancelled_by    → cancelledBy
 *   processed_at    → approvedAt
 *   processed_by    → approvedBy
 *
 * New fields added with defaults:
 *   borrowerRole    → derived from user.role (fallback: 'student')
 *   handedOverBy    → null
 *   handedOverAt    → null
 *   returnedConfirmedBy → null
 *   returnedAt      → null
 *   actualReturnDate → null
 *
 * Fields removed:
 *   type, available (Equipment only), borrowed_by (Equipment only)
 *
 * Usage:
 *   node src/scripts/migrateBorrowRequests.js
 *
 * Run in a staging environment first. The script is IDEMPOTENT —
 * it skips documents that already have the new fields.
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const db = mongoose.connection.db
  const col = db.collection('borrowrequests')

  // Only process docs that still have old field names
  const cursor = col.find({ user_id: { $exists: true } })
  let migrated = 0
  let skipped = 0

  while (await cursor.hasNext()) {
    const doc = await cursor.next()

    // Skip if already migrated (borrowerId exists)
    if (doc.borrowerId) {
      skipped++
      continue
    }

    // Determine borrowerRole
    let borrowerRole = 'student'
    if (doc.user_id) {
      try {
        const user = await db.collection('users').findOne({ _id: doc.user_id }, { projection: { role: 1 } })
        if (user?.role === 'lecturer') borrowerRole = 'lecturer'
      } catch (_) {
        // fallback to 'student'
      }
    }

    const $set = {
      borrowerId: doc.user_id,
      borrowerRole,
      equipmentId: doc.equipment_id,
      roomId: doc.room_id,
      borrowDate: doc.borrow_date,
      expectedReturnDate: doc.return_date,
      decisionNote: doc.decision_note,
      cancelledAt: doc.cancelled_at,
      cancelledBy: doc.cancelled_by,
      approvedAt: doc.processed_at,
      approvedBy: doc.processed_by,
      handedOverBy: null,
      handedOverAt: null,
      returnedConfirmedBy: null,
      returnedAt: null,
      actualReturnDate: null,
    }

    const $unset = {
      user_id: '',
      equipment_id: '',
      room_id: '',
      borrow_date: '',
      return_date: '',
      decision_note: '',
      cancelled_at: '',
      cancelled_by: '',
      processed_at: '',
      processed_by: '',
      type: '',
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
