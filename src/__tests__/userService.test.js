import { describe, expect, test } from 'vitest'
import {
  isUsernameExists,
  isEmailExists
} from '../services/userService.js'


const mockUsers = [
  { username: 'alice', email: 'alice@gmail.com', password: 'password123' },
  { username: 'bob', email: 'bob@gmail.com', password: 'securepass1' },
]

describe('User Service Tests', () => {
  test('Username exists', () => {
    expect(isUsernameExists(mockUsers, 'alice')).toBe(true)
    expect(isUsernameExists(mockUsers, 'john')).toBe(false)
  })

  test('Email exists', () => {
    expect(isEmailExists(mockUsers, 'bob@gmail.com')).toBe(true)
    expect(isEmailExists(mockUsers, 'test@gmail.com')).toBe(false)
  })
})
