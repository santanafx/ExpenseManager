import type { ROLE } from '../../../domain/user/enums/role.js'

export class CreateUserInputModel {
  constructor(readonly name: string, readonly email: string, readonly password: string, readonly role?: ROLE | undefined) {
    this.name = name
    this.email = email
    this.password = password
    this.role = role
  }
}
