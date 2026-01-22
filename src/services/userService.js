export function isUsernameExists(users, username) {
  return users.some(u => u.username === username)
}

export function isEmailExists(users, email) {
  return users.some(u => u.email === email)
}
