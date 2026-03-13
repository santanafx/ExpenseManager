import type { ROLE } from '../../../domain/user/enums/role.js'

export interface UpdateUserInputModel {
  id: string
  name?: string
  email?: string
  password?: string
  role?: ROLE
}
