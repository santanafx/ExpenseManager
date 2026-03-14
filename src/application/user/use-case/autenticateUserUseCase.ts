import { compare } from "bcryptjs";
import type { User } from "../../../domain/user/entities/user.js";
import type { IUserRepository } from "../../../domain/user/repositories/iUserRepository.js";
import { AppError } from "../../common/errors/appError.js";
import type { IJWTService } from "../../common/interfaces/iJWTService.js";

export class AutenticateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: IJWTService
  ) { }

  async execute(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new AppError(401, 'Invalid user credentials.')

    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) throw new AppError(401, 'Invalid user credentials.')

    const token = this.jwtService.sign({
      sub: user.id,
      role: user.role
    })

    return {
      user,
      token
    }
  }
}