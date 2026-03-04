export interface JWTPayload {
  sub: string
  role: string
}

export interface IJWTService {
  sign(payload: JWTPayload): string
  verify(token: string): JWTPayload
}