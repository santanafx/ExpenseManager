import { Entity } from '../../common/entity.js'
import type { ROLE } from '../enums/role.js'

export class User extends Entity {
  constructor(
    id: string,
    private _name: string,
    private _email: string,
    private _role: ROLE,
    private _password_hash: string,
    private _created_at: Date = new Date()
  ) {
    super()
    this.id = id
  }

  get name(): string { return this._name }
  get email(): string { return this._email }
  get role(): ROLE { return this._role }
  get password_hash(): string { return this._password_hash }
  get created_at(): Date { return this._created_at }

  set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Name cannot be empty')
    }
    this._name = value
  }

  set email(value: string) {
    this._email = value
  }

  set role(value: ROLE) {
    this._role = value
  }

  set password_hash(value: string) {
    this._password_hash = value
  }
}