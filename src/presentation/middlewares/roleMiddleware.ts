import type { Request, Response, NextFunction } from 'express'
import { Role } from '../../infrastructure/persistence/prisma/generated/enums.js'

export function roleMiddleware(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as Role | undefined

    if (!userRole) {
      return res.status(403).send({ message: 'Access denied: role not found' })
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).send({ message: 'Access denied: insufficient permission' })
    }

    next()
  }
}

export const adminOnly = roleMiddleware(Role.ADMIN)
