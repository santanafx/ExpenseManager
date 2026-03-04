import 'dotenv/config'
import express from 'express'
import { routes } from './presentation/routes/index.js'
import { errorMiddleware } from './presentation/middlewares/errorMiddleware.js'

export const app = express()

app.use(express.json())
app.use('/api', routes)
app.use(errorMiddleware)

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
