import { describe, it, expect, vi, beforeEach } from 'vitest'
import { borrowRequestService } from '../src/services/borrowRequestService.js'
import BorrowRequest from '../src/models/BorrowRequest.js'
import Equipment from '../src/models/Equipment.js'

// ─── MOCKS ──────────────────────────────────────────────────────────────────
vi.mock('../src/models/BorrowRequest.js')
vi.mock('../src/models/User.js')
vi.mock('../src/models/Equipment.js')
vi.mock('../src/models/Room.js')
vi.mock('../src/utils/ApiError.js', () => {
  return {
    default: class ApiError extends Error {
      constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode
      }
    }
  }
})

describe('borrowRequestService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-19T10:00:00Z'))
  })

  describe('createBorrowRequest()', () => {
    // Branch 1: Missing required fields
    it('should throw "All required fields must be provided" if user_id is missing (BVA)', async () => {
      console.log('🧪 Test: Missing required fields branch')
      const body = { equipment_id: 'e1' } // missing user_id
      
      await expect(borrowRequestService.createBorrowRequest(body))
        .rejects.toThrow('All required fields must be provided')
    })

    // Branch 2: Equipment status is "broken"
    it('should throw "Equipment is broken" if equipment status is "broken" (Decision)', async () => {
      console.log('🧪 Test: Equipment status is "broken" branch')
      const body = { 
        user_id: 'u1', 
        equipment_id: 'e1', 
        borrow_date: '2026-03-19T11:00:00Z', 
        return_date: '2026-03-19T12:00:00Z' 
      }
      
      Equipment.findById.mockResolvedValue({ status: 'broken' })
      
      await expect(borrowRequestService.createBorrowRequest(body))
        .rejects.toThrow('Equipment is broken')
      expect(Equipment.findById).toHaveBeenCalledWith('e1')
    })

    // Branch 3: Date conflicts with existing borrow
    it('should throw "Date conflicts with existing borrow" if overlap found (Decision)', async () => {
      console.log('🧪 Test: Date conflicts branch')
      const body = { 
        user_id: 'u1', 
        equipment_id: 'e1', 
        borrow_date: '2026-03-19T11:00:00Z', 
        return_date: '2026-03-19T12:00:00Z' 
      }
      
      Equipment.findById.mockResolvedValue({ status: 'available' })
      // Mock finding an existing approved/handed_over request in the same window
      BorrowRequest.find.mockResolvedValue([{ _id: 'conflict1' }])
      
      await expect(borrowRequestService.createBorrowRequest(body))
        .rejects.toThrow('Date conflicts with existing borrow')
      expect(BorrowRequest.find).toHaveBeenCalled()
    })

    // Branch 4: Successful borrow request
    it('should return success message and borrowRequest on valid input (Success Path)', async () => {
      console.log('🧪 Test: Successful borrow request branch')
      const body = { 
        user_id: 'u1', 
        equipment_id: 'e1', 
        borrow_date: '2026-03-19T11:00:00Z', 
        return_date: '2026-03-19T12:00:00Z',
        type: 'equipment'
      }
      
      const mockNewRequest = { _id: 'req123', ...body, status: 'pending' }
      
      Equipment.findById.mockResolvedValue({ status: 'available' })
      BorrowRequest.find.mockResolvedValue([]) // No conflicts
      BorrowRequest.create.mockResolvedValue(mockNewRequest)
      
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        then: vi.fn((resolve) => resolve(mockNewRequest))
      }
      BorrowRequest.findById.mockReturnValue(mockQuery)

      const result = await borrowRequestService.createBorrowRequest(body)

      expect(result.message).toBe('Borrow request created successfully')
      expect(result.borrowRequest).toEqual(mockNewRequest)
      expect(BorrowRequest.create).toHaveBeenCalled()
      expect(BorrowRequest.findById).toHaveBeenCalledWith('req123')
    })
  })
})
