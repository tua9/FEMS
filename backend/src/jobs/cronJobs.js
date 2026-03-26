import cron from 'node-cron'
import { borrowRequestService } from '../services/borrowRequestService.js'

/**
 * Initialize all background cron jobs.
 */
export const initCronJobs = () => {
  console.log('⏰ Initializing background cron jobs...')

  // Every 5 minutes: cancel pending/approved requests whose slot has ended
  cron.schedule('*/5 * * * *', async () => {
    try {
      await borrowRequestService.autoCancelSlotEndedRequests()
    } catch (error) {
      console.error('❌ [CRON] Error in autoCancelSlotEndedRequests:', error)
    }
  })

  // Daily at 08:00: alert admins about overdue handed-over items
  cron.schedule('0 8 * * *', async () => {
    console.log('🔍 [CRON] Daily check for overdue borrows...')
    try {
      await borrowRequestService.checkOverdueHandedOverRequests()
    } catch (error) {
      console.error('❌ [CRON] Error in overdue borrow check:', error)
    }
  })

  console.log('✅ Cron jobs scheduled successfully.')
}
