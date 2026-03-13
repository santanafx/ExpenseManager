import { UserRepository } from '../../../infrastructure/persistence/user/repository/userRepository.js'
import { UpdateUserUseCase } from '../use-case/updateUserUseCase.js'

export function makeUpdateUserUseCase(): UpdateUserUseCase {
  const userRepository = new UserRepository()
  return new UpdateUserUseCase(userRepository)
}
