import type { ROLE } from '../../../domain/user/enums/role.js'

export interface CreateUserInputModel {
  name: string
  email: string
  password: string
  role?: ROLE
}
