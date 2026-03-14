import type { IUserRepository } from "../../../domain/user/repositories/iUserRepository.js"
import { User } from "../../../domain/user/entities/user.js"
import type { UpdateUserRoleInputModel } from "../input-models/updateUserRoleInputModel.js"
import type { UpdateUserViewModel } from "../view-models/updateUserViewModel.js"
import { AppError } from "../../common/errors/appError.js"

export class UpdateUserRoleUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(input: UpdateUserRoleInputModel): Promise<UpdateUserViewModel> {
    const existingUser = await this.userRepository.findById(input.id)
    if (!existingUser) {
      throw new AppError(404, 'User not found')
    }

    const updatedUser = new User({
      name: existingUser.name,
      email: existingUser.email,
      role: input.role,
      password_hash: existingUser.password_hash,
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
