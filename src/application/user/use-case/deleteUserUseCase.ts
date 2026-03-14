import type { IUserRepository } from "../../../domain/user/repositories/iUserRepository.js";
import type { DeleteUserInputModel } from "../input-models/deleteUserInputModel.js";
import type { DeleteUserViewModel } from "../view-models/deleteUserViewModel.js";
import { AppError } from "../../common/errors/appError.js";

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(input: DeleteUserInputModel): Promise<DeleteUserViewModel> {
    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new AppError(404, 'User not found.')
    }

    await this.userRepository.delete(input.id)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  }
}