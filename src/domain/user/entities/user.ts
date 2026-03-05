import { Entity } from '../../common/entity.js'
import type { ROLE } from '../enums/role.js'

export class User extends Entity {
  constructor(
    id: string,
    private _name: string,
    private _email: string,
    private _role: ROLE,
    private _password_hash: string,
    private _created_at: Date = new Date(),
    private _updated_at: Date
  ) {
    super()
    this.id = id
  }

  public get name(): string { return this._name }
  public get email(): string { return this._email }
  public get role(): ROLE { return this._role }
  public get password_hash(): string { return this._password_hash }
  public get created_at(): Date { return this._created_at }
  public get updated_at(): Date { return this._updated_at }

  private set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Name cannot be empty')
    }
    this._name = value
  }

  private set email(value: string) {
    this._email = value
  }

  private set role(value: ROLE) {
    this._role = value
  }

  private set password_hash(value: string) {
    this._password_hash = value
  }
}