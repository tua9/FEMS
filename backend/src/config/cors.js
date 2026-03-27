import { WHITELIST_DOMAINS } from '../utils/constants.js'
import ApiError from '../utils/ApiError.js'
import { env } from './environment.js'
import { StatusCodes } from 'http-status-codes'

export const corsOptions = {
  origin: (origin, callback) => {
    // Nếu không có origin (như khi dùng Postman hoặc server-to-server) 
    // và đang ở chế độ dev thì cho phép
    if (!origin && env.BUILD_MODE === 'dev') return callback(null, true)

    // Normalize origin: bỏ dấu / ở cuối nếu có để so sánh chính xác hơn
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : origin

    const isAllowed = WHITELIST_DOMAINS.includes(normalizedOrigin) || 
                     (normalizedOrigin && normalizedOrigin.endsWith('.vercel.app')) || 
                     (normalizedOrigin && (normalizedOrigin.endsWith('.ngrok-free.app') || 
                                          normalizedOrigin.endsWith('.ngrok-free.dev') || 
                                          normalizedOrigin.endsWith('.ngrok.io')))

    if (isAllowed) return callback(null, true)

    console.log(`🔥 CORS Error: Origin [${origin}] (Normalized: [${normalizedOrigin}]) is not allowed.`)
    console.log(`Current WHITELIST_DOMAINS:`, WHITELIST_DOMAINS)

    return callback(
      new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by CORS`)
    )
  },

  optionsSuccessStatus: 200,
  credentials: true,
}