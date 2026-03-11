import type { ROLE } from "../../../domain/user/enums/role.js"

export interface DeleteUserViewModel {
  id: string
  name: string
  email: string
  role: ROLE
}