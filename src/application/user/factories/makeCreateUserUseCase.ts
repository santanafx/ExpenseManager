import { UserRepository } from '../../../infrastructure/persistence/user/repository/userRepository.js'
import { CreateUserUseCase } from '../use-case/createUserUseCase.js'

export function makeCreateUserUseCase(): CreateUserUseCase {
  const userRepository = new UserRepository()
  return new CreateUserUseCase(userRepository)
}
