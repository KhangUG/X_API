import { MongoClient, Db, Collection } from 'mongodb'
import User from '../models/schemas/User.schema'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import Follower from '~/models/schemas/Follower.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import { envConfig } from '~/constants/config'
import Bookmark from '~/models/schemas/Bookmark.schema'
import Like from '~/models/schemas/Like.schema'


// URI kết nối tới MongoDB
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@x-api.xy7gt.mongodb.net/?retryWrites=true&w=majority&appName=X-API`

class DatabaseServices {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('There was an error connecting to MongoDB. Check your connection string. Error: ', error)
    }
  }
  get users(): Collection<User> {
    return this.db.collection(envConfig.dbTweetsCollection)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection)
  }
  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.dbFollowersCollection)
  }
  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.dbTweetsCollection)
  }
  get hashtags(): Collection<Hashtag> {
    return this.db.collection(envConfig.dbHashtagsCollection)
  }
  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(envConfig.dbBookmarksCollection)
  }
  get likes(): Collection<Like> {
    return this.db.collection(envConfig.dbLikesCollection)
  }
}

// Tạo object từ class DatabaseServices
const databaseService = new DatabaseServices()

export default databaseService
