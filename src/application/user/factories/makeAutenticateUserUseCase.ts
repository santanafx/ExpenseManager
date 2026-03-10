import { UserRepository } from '../../../infrastructure/persistence/user/repository/userRepository.js'
import { JWTService } from '../../../infrastructure/services/jwtService.js'
import { AutenticateUserUseCase } from '../use-case/autenticateUserUseCase.js'

export function makeAutenticateUserUseCase(): AutenticateUserUseCase {
  const userRepository = new UserRepository()
  const jwtService = new JWTService()
  return new AutenticateUserUseCase(userRepository, jwtService)
}
