import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const createUser = async () => {
  try {
    // connect DB
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    console.log('✅ Connected DB')

    const username = 'student01'
    const email = 'student01@fems.com'
    const password = '123456'
    const role = 'student'
    const displayName = 'System Student'

    // check tồn tại
    const existing = await User.findOne({ username })
    if (existing) {
      console.log('⚠️ User already exists')
      process.exit(0)
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create user
    await User.create({
      username,
      email,
      hashedPassword,
      role,
      displayName,
    })

    console.log('🎉 User created successfully!')
    console.log('Login info:')
    console.log('username:', username)
    console.log('password:', password)
    console.log('role:', role)

    process.exit(0)
  } catch (err) {
    console.error('❌ Error creating user:', err)
    process.exit(1)
  }
}

createUser()