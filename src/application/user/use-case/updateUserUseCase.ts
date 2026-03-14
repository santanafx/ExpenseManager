import type { IUserRepository } from '../../../domain/user/repositories/iUserRepository.js'
import { User } from '../../../domain/user/entities/user.js'
import type { UpdateUserInputModel } from '../input-models/updateUserInputModel.js'
import type { UpdateUserViewModel } from '../view-models/updateUserViewModel.js'
import bcrypt from 'bcryptjs'
import { AppError } from '../../common/errors/appError.js'

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(input: UpdateUserInputModel): Promise<UpdateUserViewModel> {
    const existingUser = await this.userRepository.findById(input.id)
    if (!existingUser) {
      throw new AppError(404, 'User not found')
    }

    if (input.email && input.email !== existingUser.email) {
      const emailInUse = await this.userRepository.findByEmail(input.email)
      if (emailInUse) {
        throw new AppError(400, 'Email already in use')
      }
    }

    const password_hash = input.password
      ? await bcrypt.hash(input.password, 10)
      : existingUser.password_hash

    const updatedUser = new User({
      name: input.name ?? existingUser.name,
      email: input.email ?? existingUser.email,
      role: input.role ?? existingUser.role,
      password_hash,
      created_at: existingUser.created_at,
      updated_at: new Date(),
    }, existingUser.id)

    const savedUser = await this.userRepository.update(updatedUser)

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      created_at: savedUser.created_at,
      updated_at: savedUser.updated_at,
    }
  }
}
