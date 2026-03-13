import type { ROLE } from '../../../domain/user/enums/role.js'

export interface UpdateUserRoleInputModel {
  id: string
  role: ROLE
}
