import { compare } from "bcryptjs";
import type { User } from "../../../domain/user/entities/user.js";
import type { UserRepository } from "../../../infrastructure/persistence/user/userRepository.js";
import { InvalidUsersCredentials } from "../../common/errors/invalidUsersCredentials.js";

export class AutenticateUserUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(email: string, password: string): Promise<{ user: User }> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new InvalidUsersCredentials()

    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) throw new InvalidUsersCredentials()

    return {
      user
    }
  }
}