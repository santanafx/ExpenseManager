import { User } from '../../../domain/user/entities/user.js'
import { ROLE } from '../../../domain/user/enums/role.js'
import type { IUserRepository } from '../../../domain/user/repositories/iUserRepository.js'
import { prisma } from '../db-context/server.js'
import { Role } from '../generated/prisma/enums.js'
import type { UserModel } from '../generated/prisma/models/User.js'

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const createdUser = await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: this.mapRoleToDatabase(user.role),
        password_hash: user.password_hash,
        created_at: user.created_at
      }
    })

    return this.mapToDomain(createdUser)
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    return user ? this.mapToDomain(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    return user ? this.mapToDomain(user) : null
  }

  async update(user: User): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        role: this.mapRoleToDatabase(user.role),
        password_hash: user.password_hash
      }
    })

    return this.mapToDomain(updatedUser)
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    })
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany()
    return users.map((user) => this.mapToDomain(user))
  }

  private mapToDomain(prismaUser: UserModel): User {
    const user = new User(prismaUser.id, prismaUser.name, prismaUser.email, this.mapRoleFromDatabase(prismaUser.role), prismaUser.password_hash, prismaUser.created_at)
    return user
  }

  private mapRoleToDatabase(role: ROLE): Role {
    return role === ROLE.ADMIN ? Role.ADMIN : Role.BASIC_USER
  }

  private mapRoleFromDatabase(role: Role): ROLE {
    return role === Role.ADMIN ? ROLE.ADMIN : ROLE.BASIC_USER
  }
}
