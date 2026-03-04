import type { JWTPayload } from '../application/common/interfaces/iJWTService'

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

export { }
