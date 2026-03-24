import cron from 'node-cron'
import { borrowRequestService } from '../services/borrowRequestService.js'

/**
 * Initialize all background cron jobs.
 */
export const initCronJobs = () => {
  console.log('⏰ Initializing background cron jobs...')

  // Run every 10 minutes to check for expired (uncollected) borrow requests
  // This will catch requests that passed their 17:00 deadline on their borrow_date
  cron.schedule('*/10 * * * *', async () => {
    console.log('🔍 [CRON] Checking for uncollected borrow requests...')
    try {
      await borrowRequestService.autoCancelExpiredRequests()
    } catch (error) {
      console.error('❌ [CRON] Error in autoCancelExpiredRequests:', error)
    }
  })

  // Optional: Run specifically at 17:05 daily as a safety check
  cron.schedule('5 17 * * *', async () => {
    console.log('🔍 [CRON] Daily 17:05 check for uncollected borrow requests...')
    try {
      await borrowRequestService.autoCancelExpiredRequests()
    } catch (error) {
      console.error('❌ [CRON] Error in daily auto-cancel check:', error)
    }
  })

  console.log('✅ Cron jobs scheduled successfully.')
}
