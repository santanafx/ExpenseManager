import type { ROLE } from '../../../domain/user/enums/role.js'

export class UserViewModel {
  id: string
  name: string
  email: string
  role: ROLE
  created_at: Date

  constructor(id: string, name: string, email: string, role: ROLE, created_at: Date) {
    this.id = id
    this.name = name
    this.email = email
    this.role = role
    this.created_at = created_at
  }
}
