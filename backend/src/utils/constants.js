import { env } from '../config/environment.js'
export const WHITELIST_DOMAINS = [
  env.CLIENT_URL,
  'https://fems-mocha.vercel.app',
  'https://fems-project.vercel.app', // Adding a common variation just in case
  'https://bianca-appendicular-boldheartedly.ngrok-free.dev',
  'http://localhost:5175',
  'http://localhost:5174',
  'http://localhost:5173'
]