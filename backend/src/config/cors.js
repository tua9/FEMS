import { WHITELIST_DOMAINS } from '../utils/constants.js'
import ApiError from '../utils/ApiError.js'
import { env } from './environment.js'
import { StatusCodes } from 'http-status-codes'

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin && env.BUILD_MODE === 'dev') return callback(null, true)

    const isAllowed = WHITELIST_DOMAINS.includes(origin) || 
                     (origin && origin.endsWith('.vercel.app')) || 
                     (origin && (origin.endsWith('.ngrok-free.app') || 
                                origin.endsWith('.ngrok-free.dev') || 
                                origin.endsWith('.ngrok.io')))

    if (isAllowed) return callback(null, true)

    console.log(`🔥 Error: ${origin} not allowed by CORS`)

    return callback(
      new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by CORS`)
    )
  },

  optionsSuccessStatus: 200,
  credentials: true,
}