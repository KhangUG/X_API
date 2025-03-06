import { ObjectId, WithId, ReturnDocument } from 'mongodb'
import databaseService from '~/services/database.services'

class LikeService {
  async likeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: {
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id),
          created_at: new Date() // Thêm thời gian tạo
        }
      },
      {
        upsert: true,
        returnDocument: 'after' // Thử thay returnDocument: 'after'
      }
    )
    return result as WithId<{ user_id: ObjectId; tweet_id: ObjectId; created_at: Date }>
  }
  // async likeTweet(user_id: string, tweet_id: string) {
  //   console.log('🔍 Debug - user_id:', user_id, 'tweet_id:', tweet_id)

  //   const query = {
  //     user_id: new ObjectId(user_id),
  //     tweet_id: new ObjectId(tweet_id)
  //   }
  //   const update = {
  //     $setOnInsert: {
  //       user_id: new ObjectId(user_id),
  //       tweet_id: new ObjectId(tweet_id),
  //       created_at: new Date()
  //     }
  //   }
  //   const options = {
  //     upsert: true,
  //     returnDocument: ReturnDocument.AFTER
  //   }

  //   console.log('📌 Query:', query)
  //   console.log('📌 Update:', update)
  //   console.log('📌 Options:', options)

  //   const result = await databaseService.likes.findOneAndUpdate(query, update, options)

  //   console.log('✅ Result:', result)

  //   return result as WithId<{ user_id: ObjectId; tweet_id: ObjectId; created_at: Date }>
  // }

  async unlikeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
}

const likeService = new LikeService()
export default likeService
