import type { Request, Response, NextFunction } from 'express'
import { ROLE } from '../../domain/user/enums/role.js'

export function roleMiddleware(...allowedRoles: ROLE[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as ROLE | undefined

    if (!userRole) {
      return res.status(403).send({ message: 'Access denied: role not found' })
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).send({ message: 'Access denied: insufficient permission' })
    }

    next()
  }
}

export const adminOnly = roleMiddleware(ROLE.ADMIN)
