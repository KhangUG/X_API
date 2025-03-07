import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import tweetsService from '~/services/tweets.services'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)
  res.json({
    message: 'Create Tweet Successfully',
    result
  })
  return
}
export const getTweetController = async (req: Request, res: Response) => {
  const user_id = req.decoded_authorization?.user_id || ''
  const result = await tweetsService.increaseView(req.params.tweet_id, user_id)
  const tweet = {
    ...req.tweet,
    user_views: result.user_views,
    guest_views: result.guest_views
  }
  res.json({
    message: 'Get Tweet Successfully',
    result: tweet
  })
  return
}
