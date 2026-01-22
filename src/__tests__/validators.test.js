import { describe, expect, test } from 'vitest'
import cases from '../data/validators.testcases.json'
import { isEmpty, isValidPassword, isValidEmail } from '../utils/validators'

describe('isEmpty', () => {
  cases.forEach(tc => {
    test(tc.desc, () => {
      expect(isEmpty(tc.value)).toBe(tc.expected)
    })
  })
})

describe('isValidPassword', () => {
  test('Password < 8 → false', () => {
    expect(isValidPassword('123')).toBe(false)
  })

  test('Password >= 8 → true', () => {
    expect(isValidPassword('12345678')).toBe(true)
  })
})

describe('isValidEmail', () => {
  test('Email đúng format', () => {
    expect(isValidEmail('a@b.com')).toBe(true)
  })

  test('Email sai format', () => {
    expect(isValidEmail('abc@')).toBe(false)
  })

  test('Email rỗng', () => {
    expect(isValidEmail('')).toBe(false)
  })
})
