import type { Request, Response } from 'express'
import { Router } from 'express'
import { z } from 'zod'
import { UserRepository } from '../../infrastructure/persistence/user/repository/userRepository.js'
import { CreateUserUseCase } from '../../application/user/use-case/createUserUseCase.js'
import { CreateUserInputModel } from '../../application/user/input-models/createUserInputModel.js'
import { ROLE } from '../../domain/user/enums/role.js'
import { createUserSchema } from '../validators/users/createUserSchema.js'
import { loginSchema } from '../validators/users/loginSchema.js'
import { LoginInputModel } from '../../application/user/input-models/loginInputModel.js'
import { AutenticateUserUseCase } from '../../application/user/use-case/autenticateUserUseCase.js'
import { InvalidUsersCredentials } from '../../application/common/errors/invalidUsersCredentials.js'
import { JWTService } from '../../infrastructure/services/jwtService.js'

const userRouter = Router()

userRouter.post('/user', async (req: Request, res: Response) => {
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

userRouter.post('/user/login', async (req: Request, res: Response) => {
  try {
    const validatedBody = loginSchema.parse(req.body)

    const input = new LoginInputModel(
      validatedBody.email,
      validatedBody.password
    )

    const userRepository = new UserRepository()
    const jwtService = new JWTService()
    const autenticate = new AutenticateUserUseCase(userRepository, jwtService)

    const { token } = await autenticate.execute(input.email, input.password)

    return res.status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidUsersCredentials) {
      return res.status(400).send()
    }

    return res.status(500).send()
  }
})

export { userRouter }
