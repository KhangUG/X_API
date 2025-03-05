import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controllers'
import { creatTweetValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Description. Create a new tweet
 * Path: /
 * Method: POST
 * Body: TweetReqBody
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  creatTweetValidator,
  wrapRequestHandler(createTweetController)
)

export default tweetsRouter
