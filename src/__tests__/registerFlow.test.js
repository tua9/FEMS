import users from '../data/users.json'
import cases from '../data/register.testcases.json'
import { register } from '../services/registerService'
import { describe, expect, test } from 'vitest'

describe('Register Flow – Data Driven', () => {
  cases.forEach(tc => {
    test(tc.desc, () => {
      const result = register(users, tc.input)
      expect(result).toBe(tc.expected)
    })
  })
})
