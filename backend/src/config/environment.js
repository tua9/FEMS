import dotenv from 'dotenv'

dotenv.config()

export const env = {
  BUILD_MODE: process.env.BUILD_MODE || 'dev',
  PORT: process.env.PORT || 5001,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
}
