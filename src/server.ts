import 'dotenv/config'
import express from 'express'

import { errorMiddleware } from './presentation/middlewares/errorMiddleware.js'
import { router } from './presentation/routes/index.js'
import swaggerUi from 'swagger-ui-express'
import { generateSwaggerDocument } from './presentation/docs/swaggerConfig.js'

export const app = express()

app.use(express.json())
app.use('/api', router)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(generateSwaggerDocument()))
app.use(errorMiddleware)

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
