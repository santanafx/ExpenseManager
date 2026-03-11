import type { IUserRepository } from "../../../domain/user/repositories/iUserRepository.js";
import type { DeleteUserInputModel } from "../input-models/deleteUserInputModel.js";
import type { DeleteUserViewModel } from "../view-models/deleteUserViewModel.js";
import { appEventEmitter } from "../../../infrastructure/events/appEventEmitter.js";

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(input: DeleteUserInputModel): Promise<DeleteUserViewModel> {
    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new Error('User not found.')
    }

    await this.userRepository.delete(input.id)

    appEventEmitter.emit('user.deleted', { userId: user.id, email: user.email })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  }
}