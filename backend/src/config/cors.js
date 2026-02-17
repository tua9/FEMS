import { WHITELIST_DOMAINS } from '../constants.js'
import ApiError from '../utils/ApiError.js'
import { env } from './environment.js'
import { StatusCodes } from 'http-status-codes'

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin && env.BUILD_MODE === 'dev') return callback(null, true)

    if (WHITELIST_DOMAINS.includes(origin)) return callback(null, true)

    console.log('error')

    return callback(
      new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by CORS`),
    )
  },

  optionSuccessStatus: 200,
  credentials: true,
}
