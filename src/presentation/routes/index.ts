import { Router } from 'express'
import { userRouter } from './userRoutes.js'

export const routes = Router()

routes.use('/users', userRouter)
