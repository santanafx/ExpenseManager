import type { Request, Response, NextFunction } from 'express'
import type { IJWTService } from '../../application/common/interfaces/iJWTService.js'
import { JWTService } from '../../infrastructure/services/jwtService.js'

export function authMiddleware(jwtService: IJWTService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).send({ message: 'Token not provided' })
    }

    try {
      const decoded = jwtService.verify(token)
      req.user = decoded
      next()
    } catch {
      return res.status(401).send({ message: 'Invalid Token' })
    }
  }
}

const jwtService = new JWTService()
export const authMiddlewareJwt = authMiddleware(jwtService)
