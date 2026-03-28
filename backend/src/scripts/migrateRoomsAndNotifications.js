/**
 * migrateRoomsAndNotifications.js
 * - rooms: building_id → buildingId
 * - notifications: user_id → userId, read → isRead, to+state → action object
 *
 * Usage:
 *   node src/scripts/migrateRoomsAndNotifications.js
 *
 * IDEMPOTENT — skips documents already migrated.
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const migrateRooms = async (db) => {
  const col = db.collection('rooms')
  const cursor = col.find({ building_id: { $exists: true } })
  let migrated = 0

  while (await cursor.hasNext()) {
    const doc = await cursor.next()
    if (doc.buildingId) continue

    await col.updateOne(
      { _id: doc._id },
      {
        $set: { buildingId: doc.building_id },
        $unset: { building_id: '' },
      },
    )
    migrated++
  }

  console.log(`Rooms migrated: ${migrated}`)
}

const migrateNotifications = async (db) => {
  const col = db.collection('notifications')
  const cursor = col.find({ user_id: { $exists: true } })
  let migrated = 0

  while (await cursor.hasNext()) {
    const doc = await cursor.next()
    if (doc.userId) continue

    // Map old to/state to action object
    const action = {
      type: doc.to ? 'open_detail' : 'none',
      resource: doc.state?.type || null,
      resourceId: doc.state?.id || null,
      payload: doc.state || null,
    }

    await col.updateOne(
      { _id: doc._id },
      {
        $set: {
          userId: doc.user_id,
          isRead: doc.read ?? false,
          action,
        },
        $unset: { user_id: '', read: '', to: '', state: '' },
      },
    )
    migrated++
  }

  console.log(`Notifications migrated: ${migrated}`)
}

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const db = mongoose.connection.db
  await migrateRooms(db)
  await migrateNotifications(db)

  console.log('\nAll done.')
  await mongoose.disconnect()
}

run().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
