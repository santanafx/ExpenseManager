import 'dotenv/config'
import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import { userRouter } from '../../../api/controllers/userController.js'
import { ZodError } from 'zod'

export const app = express()

app.use(express.json())

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'dev' ? ['query'] : []
})

app.use('/api', userRouter)

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
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
});

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server is running on port ${process.env.PORT || 3333}`)
})