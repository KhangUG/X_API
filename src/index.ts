import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { pick } from 'lodash'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from '~/routes/static.routes'
import tweetsRouter from '~/routes/tweets.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import { createServer } from 'http'
import { Server } from 'socket.io'

config()

databaseService.connect()

const app = express()
const httpServer = createServer(app)

const port = process.env.PORT || 4000

// Tao folder uploads
initFolder()

app.use(express.json())
app.use('/users', userRouter)
app.use('/medias', mediasRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
