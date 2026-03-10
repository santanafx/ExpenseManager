import type { IUserRepository } from '../../../domain/user/repositories/iUserRepository.js'
import { User } from '../../../domain/user/entities/user.js'
import { ROLE } from '../../../domain/user/enums/role.js'
import type { CreateUserInputModel } from '../input-models/createUserInputModel.js'
import type { UserViewModel } from '../view-models/userViewModel.js'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(input: CreateUserInputModel): Promise<UserViewModel> {
    const existingUser = await this.userRepository.findByEmail(input.email)
    if (existingUser) {
      throw new Error('Email already in use')
    }

    const password_hash = await bcrypt.hash(input.password, 10)

    const user = new User({
      name: input.name,
      email: input.email,
      role: input.role ?? ROLE.BASIC_USER,
      password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    }, randomUUID())

    const createdUser = await this.userRepository.create(user)

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      created_at: createdUser.created_at,
    }
  }
}
