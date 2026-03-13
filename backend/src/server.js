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
import adminRoutes from './routes/adminRoute.js'

import { protectedRoute } from './middlewares/authMiddlewares.js'

const app = express()
const PORT = env.PORT || 5001

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/tickets', reportRoutes)
app.use('/api/equipments', equipmentRouters)
app.use('/api/requests', borrowRequestRouters)

app.use('/api/admin/users', protectedRoute, userRoutes)
app.use('/api/admin', adminRoutes)

// Other facilities routes
app.use('/api/buildings', buildingRouters)
app.use('/api/rooms', roomRouters)

import { errorHandlingMiddleware } from './middlewares/errorMiddleware.js'

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})

// Error handling middleware
app.use(errorHandlingMiddleware)

app.get('/', (req, res) => {
  res.send('Hello, World!')
})
