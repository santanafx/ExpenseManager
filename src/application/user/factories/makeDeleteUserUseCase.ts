import { UserRepository } from '../../../infrastructure/persistence/user/repository/userRepository.js'
import { DeleteUserUseCase } from '../use-case/deleteUserUseCase.js'
import { appEventEmitter } from '../../../infrastructure/events/appEventEmitter.js'

appEventEmitter.on('user.deleted', ({ userId, email }: { userId: string; email: string }) => {
  console.log(`[user.deleted] userId=${userId} email=${email}`)
})

export function makeDeleteUserUseCase(): DeleteUserUseCase {
  return new DeleteUserUseCase(new UserRepository())
}
