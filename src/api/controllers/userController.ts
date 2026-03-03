import type { Request, Response } from 'express'
import { Router } from 'express'
import { z } from 'zod'
import { UserRepository } from '../../infrastructure/persistence/user/userRepository.js'
import { CreateUserUseCase } from '../../application/user/use-case/createUserUseCase.js'
import { CreateUserInputModel } from '../../application/user/input-models/createUserInputModel.js'
import { ROLE } from '../../domain/user/enums/role.js'
import { createUserSchema } from '../validators/createUserSchema.js'

const userRouter = Router()

userRouter.post('/users', async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body)

    const role = validatedData.role === 'ADMIN' ? ROLE.ADMIN : ROLE.BASIC_USER

    const input = new CreateUserInputModel(
      validatedData.name,
      validatedData.email,
      validatedData.password,
      validatedData.role ? role : undefined
    )

    const userRepository = new UserRepository()
    const createUserUseCase = new CreateUserUseCase(userRepository)
    const userViewModel = await createUserUseCase.execute(input)

    return res.status(201).json(userViewModel)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.issues
      })
    }

    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message
      })
    }

    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})

export { userRouter }
