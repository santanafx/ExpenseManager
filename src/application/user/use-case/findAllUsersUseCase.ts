import type { IUserRepository } from "../../../domain/user/repositories/iUserRepository.js";
import { UserViewModel } from "../view-models/userViewModel.js";

export class FindAllUsersUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(): Promise<UserViewModel[]> {
    const allUsers = await this.userRepository.findAll()

    if (!allUsers) {
      throw new Error('There is no users.')
    }

    return allUsers.map(user => new UserViewModel(user.id, user.name, user.email, user.role, user.created_at))
  }
}