import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { pick } from 'lodash'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
databaseService.connect()
const app = express()
const port = 4000

app.use(express.json())
app.use('/users', userRouter)
app.use('/medias', mediasRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
