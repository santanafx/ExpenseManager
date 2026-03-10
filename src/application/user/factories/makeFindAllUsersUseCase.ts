import { UserRepository } from '../../../infrastructure/persistence/user/repository/userRepository.js'
import { FindAllUsersUseCase } from '../use-case/findAllUsersUseCase.js'

export function makeFindAllUsersUseCase(): FindAllUsersUseCase {
  const userRepository = new UserRepository()
  return new FindAllUsersUseCase(userRepository)
}
