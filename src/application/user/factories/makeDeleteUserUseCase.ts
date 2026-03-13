import { UserRepository } from '../../../infrastructure/persistence/user/repository/userRepository.js'
import { DeleteUserUseCase } from '../use-case/deleteUserUseCase.js'

export function makeDeleteUserUseCase(): DeleteUserUseCase {
  return new DeleteUserUseCase(new UserRepository())
}
