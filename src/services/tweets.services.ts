import { ObjectId, WithId } from 'mongodb'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseService from '~/services/database.services'

class TweetsService {
  async checkAndCreateHashtags(hashtags: string[]): Promise<ObjectId[]> {
    const hashtagDocuments = await Promise.all(
      hashtags.map(async (hashtag) => {
        const result = await databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          {
            $setOnInsert: new Hashtag({ name: hashtag })
          },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
        if (!result) {
          throw new Error(`Không thể tạo hoặc tìm thấy hashtag: ${hashtag}`)
        }
        return result._id
      })
    )
    return hashtagDocuments.filter((id): id is ObjectId => !!id)
  }
  async createTweet(user_id: string, body: TweetRequestBody) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags)
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: [], // Chỗ này chưa làm, tạm thời để rỗng
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )

    const tweet = await databaseService.tweets.findOne({ _id: new ObjectId(result.insertedId) })

    return tweet
  }
  async increaseView(tweet_id: string, user_id: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
    const result = await databaseService.tweets.findOneAndUpdate(
      { _id: new ObjectId(tweet_id) },
      {
        $inc: inc,
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: { user_views: 1, guest_views: 1 }
      }
    )
    return result as WithId<{
      user_views: number
      guest_views: number
    }>
  }
}

const tweetsService = new TweetsService()
export default tweetsService
