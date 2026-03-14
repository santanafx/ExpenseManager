import { Entity } from '../../common/entity.js'
import type { ROLE } from '../enums/role.js'

interface UserProps {
  name: string
  email: string
  role: ROLE
  password_hash: string
  created_at: Date
  updated_at: Date
}

export class User extends Entity<UserProps> {
  constructor(props: UserProps, id: string) {
    super(props, id)
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Name cannot be empty')
    }
    if (!props.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) {
      throw new Error('Invalid email format')
    }
    if (!props.password_hash || props.password_hash.trim().length === 0) {
      throw new Error('Password hash cannot be empty')
    }
  }

  get name(): string { return this.props.name }
  get email(): string { return this.props.email }
  get role(): ROLE { return this.props.role }
  get password_hash(): string { return this.props.password_hash }
  get created_at(): Date { return this.props.created_at }
  get updated_at(): Date { return this.props.updated_at }
}