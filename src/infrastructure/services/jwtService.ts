import jwt from 'jsonwebtoken'
import type { IJWTService, JWTPayload } from '../../application/common/interfaces/iJWTService.js'

export class JWTService implements IJWTService {
  private readonly secret: string

  constructor() {
    this.secret = process.env.JWT_SECRET || 'secret'
  }

  sign(payload: JWTPayload): string {
    return jwt.sign(
      { sub: payload.sub, role: payload.role },
      this.secret,
      { expiresIn: '7d' }
    )
  }

  verify(token: string): JWTPayload {
    return jwt.verify(token, this.secret) as JWTPayload
  }
}
