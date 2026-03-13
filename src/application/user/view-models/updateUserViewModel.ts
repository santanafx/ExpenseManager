import type { ROLE } from '../../../domain/user/enums/role.js'

export interface UpdateUserViewModel {
  id: string
  name: string
  email: string
  role: ROLE
  created_at: Date
  updated_at: Date
}
