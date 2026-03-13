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
import { makeDeleteUserUseCase } from '../../application/user/factories/makeDeleteUserUseCase.js'
import { makeUpdateUserUseCase } from '../../application/user/factories/makeUpdateUserUseCase.js'
import { adminOnly } from '../middlewares/roleMiddleware.js'
import { updateUserProfileSchema } from '../validators/users/updateUserProfileSchema.js'
import { updateUserRoleSchema } from '../validators/users/updateUserRoleSchema.js'

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

userRouter.delete('/user/:id', authMiddlewareJwt, adminOnly, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params

    const deleteUserUseCase = makeDeleteUserUseCase()
    const deletedUser = await deleteUserUseCase.execute({ id })

    return res.status(200).json({
      message: 'User deleted successfully.',
      user: deletedUser,
    })
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

userRouter.patch('/user/:id', authMiddlewareJwt, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    const validatedData = updateUserProfileSchema.parse(req.body)

    const updateUserUseCase = makeUpdateUserUseCase()
    const updatedUser = await updateUserUseCase.execute({
      id,
      ...(validatedData.name ? { name: validatedData.name } : {}),
      ...(validatedData.email ? { email: validatedData.email } : {}),
      ...(validatedData.password ? { password: validatedData.password } : {}),
    })

    return res.status(200).json(updatedUser)
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

userRouter.patch('/user/:id/role', authMiddlewareJwt, adminOnly, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    const validatedData = updateUserRoleSchema.parse(req.body)

    const role = validatedData.role === 'ADMIN' ? ROLE.ADMIN : ROLE.BASIC_USER

    const updateUserUseCase = makeUpdateUserUseCase()
    const updatedUser = await updateUserUseCase.execute({ id, role })

    return res.status(200).json(updatedUser)
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
