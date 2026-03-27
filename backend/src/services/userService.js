import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'

const getAllUsers = async () => {
  return await User.find().select('-hashedPassword')
}

const getUserById = async (id) => {
  const user = await User.findById(id).select('-hashedPassword')
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  return user
}

const updateUser = async (id, body) => {
  const user = await User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  })
    .select('-hashedPassword')
    .populate('classId', 'code name')

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  return { message: 'Update success', user }
}

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  return { message: 'Delete success' }
}

import bcrypt from 'bcrypt'

const createUser = async (body) => {
  const { username, email, password, role, displayName } = body

  if (!username || !email || !password || !role || !displayName) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'All fields are required!')
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  })

  if (existingUser) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      'User with this email or username already exists',
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await User.create({
    username,
    email,
    hashedPassword,
    role,
    displayName,
  })

  // Return user without password
  const userResponse = newUser.toObject()
  delete userResponse.hashedPassword

  return { message: 'User created successfully', user: userResponse }
}

const getUserProfile = async (id) => {
  const user = await User.findById(id)
    .select('-hashedPassword')
    .populate('classId', 'code name')
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  return user
}

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
}
