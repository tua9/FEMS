import { RegisterResult } from '../utils/registerResult'
import { isValidEmail, isValidPassword, isEmpty } from '../utils/validators'
import { isUsernameExists, isEmailExists } from './userService'

export function register(users, input) {
  const { username, email, password } = input

  if (isEmpty(username) || isEmpty(email) || isEmpty(password))
    return RegisterResult.EMPTY_FIELD

  if (!isValidEmail(email))
    return RegisterResult.EMAIL_INVALID

  if (!isValidPassword(password))
    return RegisterResult.PASSWORD_INVALID

  if (isUsernameExists(users, username))
    return RegisterResult.USERNAME_EXISTS

  if (isEmailExists(users, email))
    return RegisterResult.EMAIL_EXISTS

  return RegisterResult.SUCCESS
}