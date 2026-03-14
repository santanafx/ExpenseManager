import { UserRepository } from '../../../infrastructure/persistence/user/repository/userRepository.js'
import { UpdateUserRoleUseCase } from '../use-case/updateUserRoleUseCase.js'

export function makeUpdateUserRoleUseCase(): UpdateUserRoleUseCase {
  const userRepository = new UserRepository()
  return new UpdateUserRoleUseCase(userRepository)
}
