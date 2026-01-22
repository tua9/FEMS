export function isEmpty(value) {
  return !value || value.trim() === ''
}

export function isValidPassword(password) {
  return password.length >= 8
}

export function isValidEmail(email) {
  if (isEmpty(email)) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}