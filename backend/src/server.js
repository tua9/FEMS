import express from 'express'
import { connectDB } from './libs/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { env } from './config/environment.js'
import { corsOptions } from './config/cors.js'

import authRoutes from './routes/authRoute.js'
import userRoutes from './routes/userRoute.js'
import reportRoutes from './routes/reportRoute.js'
import buildingRouters from './routes/buildingRoute.js'
import roomRouters from './routes/roomRoute.js'
import borrowRequestRouters from './routes/borrowRequestRoute.js'
import equipmentRouters from './routes/equipmentRoute.js'

import { protectedRoute } from './middlewares/authMiddlewares.js'

const app = express()
const PORT = env.PORT || 5001

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

// public routes

app.use('/api/auth', authRoutes)
app.use('/api/reports', reportRoutes)

// private routes
app.use('/api/users', protectedRoute, userRoutes)
app.use('/api/borrow-requests', borrowRequestRouters)
app.use('/api/equipments', equipmentRouters)

// admin permission
app.use('/api/buildings', buildingRouters)
app.use('/api/rooms', roomRouters)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})

app.get('/', (req, res) => {
  res.send('Hello, World!')
})
