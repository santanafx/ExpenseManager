import type { ROLE } from '../../../domain/user/enums/role.js'

export class CreateUserInputModel {
  name: string
  email: string
  password: string
  role?: ROLE | undefined

  constructor(name: string, email: string, password: string, role?: ROLE | undefined) {
    this.name = name
    this.email = email
    this.password = password
    this.role = role
  }
}
