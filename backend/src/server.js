import express from 'express'
import { connectDB } from './libs/db.js'
import authRoutes from './routes/authRoute.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoute.js'
import { protectedRoute } from './middlewares/authMiddlewares.js'
import cors from 'cors'
import { corsOptions } from './config/cors.js'
import { env } from './config/environment.js'

const app = express()
const PORT = env.PORT || 5001

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

// public routes

app.use('/api/auth', authRoutes)

// private routes
app.use(protectedRoute)
app.use('/api/users', userRoutes)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})

app.get('/', (req, res) => {
  res.send('Hello, World!')
})
