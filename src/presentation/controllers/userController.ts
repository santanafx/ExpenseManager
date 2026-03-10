import type { Request, Response } from 'express'
import { Router } from 'express'
import { z } from 'zod'
import type { CreateUserInputModel } from '../../application/user/input-models/createUserInputModel.js'
import { ROLE } from '../../domain/user/enums/role.js'
import { createUserSchema } from '../validators/users/createUserSchema.js'
import { loginSchema } from '../validators/users/loginSchema.js'
import { InvalidUsersCredentials } from '../../application/common/errors/invalidUsersCredentials.js'
import { JWTService } from '../../infrastructure/services/jwtService.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { makeCreateUserUseCase } from '../../application/user/factories/makeCreateUserUseCase.js'
import { makeAutenticateUserUseCase } from '../../application/user/factories/makeAutenticateUserUseCase.js'
import { makeFindAllUsersUseCase } from '../../application/user/factories/makeFindAllUsersUseCase.js'

const jwtService = new JWTService()
const authMiddlewareJwt = authMiddleware(jwtService)

export const userRouter = Router()

userRouter.post('/user', authMiddlewareJwt, async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body)

    const role = validatedData.role === 'ADMIN' ? ROLE.ADMIN : ROLE.BASIC_USER

    const input: CreateUserInputModel = {
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      ...(validatedData.role ? { role } : {}),
    }

    const createUserUseCase = makeCreateUserUseCase()
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

    const autenticate = makeAutenticateUserUseCase()

    const { token } = await autenticate.execute(validatedBody.email, validatedBody.password)

    return res.status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidUsersCredentials) {
      return res.status(400).send()
    }

    return res.status(500).send()
  }
})

userRouter.get("/user/all-users", authMiddlewareJwt, async (req: Request, res: Response) => {
  try {
    const findAllUsersUseCase = makeFindAllUsersUseCase()
    const allUsers = await findAllUsersUseCase.execute()

    return res.status(200).json(allUsers)
  } catch (error) {
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
