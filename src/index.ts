import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { pick } from 'lodash'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
config()

databaseService.connect()
const app = express()
const port = process.env.PORT || 4000

// Tao folder uploads
initFolder()

app.use(express.json())
app.use('/users', userRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
