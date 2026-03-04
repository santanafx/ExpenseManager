import { compare } from "bcryptjs";
import type { User } from "../../../domain/user/entities/user.js";
import type { UserRepository } from "../../../infrastructure/persistence/user/repository/userRepository.js";
import { InvalidUsersCredentials } from "../../common/errors/invalidUsersCredentials.js";
import type { IJWTService } from "../../common/interfaces/iJWTService.js";

export class AutenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: IJWTService
  ) { }

  async execute(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new InvalidUsersCredentials()

    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) throw new InvalidUsersCredentials()

    const token = this.jwtService.sign({
      sub: user.id,
      role: String(user.role)
    })

    return {
      user,
      token
    }
  }
}