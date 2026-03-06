import type { ROLE } from '../../../domain/user/enums/role.js'

export class UserViewModel {
  constructor(public readonly id: string, public readonly name: string, public readonly email: string, public readonly role: ROLE, public readonly created_at: Date) {
    this.id = id
    this.name = name
    this.email = email
    this.role = role
  }
}
