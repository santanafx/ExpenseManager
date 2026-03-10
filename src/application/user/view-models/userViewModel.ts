import type { ROLE } from '../../../domain/user/enums/role.js'

export interface UserViewModel {
  id: string
  name: string
  email: string
  role: ROLE
  created_at: Date
}
