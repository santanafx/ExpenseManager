import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).send({
      message: 'Validation error.', issues: error.format()
    })
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    //TODO adicionar alguma ferramenta de observabilidade
  }

  return res.status(500).send({ message: 'Internal server error.' })
}
