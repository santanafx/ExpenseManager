import { Entity } from '../../common/entity.js'
import type { ROLE } from '../enums/role.js'

export class User extends Entity {
  name!: string
  email!: string
  role!: ROLE
  password_hash!: string
  created_at!: Date
}