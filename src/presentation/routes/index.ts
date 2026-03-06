import { Router } from 'express'
import { userRouter } from '../controllers/userController.js'
import { expenseRouter } from '../controllers/expenseController.js'

export const router = Router()

router.use(userRouter)
router.use(expenseRouter)
