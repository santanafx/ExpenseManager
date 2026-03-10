import type { IUserRepository } from "../../../domain/user/repositories/iUserRepository.js";
import type { UserViewModel } from "../view-models/userViewModel.js";

export class FindAllUsersUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(): Promise<UserViewModel[]> {
    const allUsers = await this.userRepository.findAll()

    if (!allUsers) {
      throw new Error('There is no users.')
    }

    return allUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    }))
  }
}