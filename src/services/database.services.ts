import { MongoClient, Db, Collection } from 'mongodb'
import User from '../models/schemas/User.schema'
import { config } from 'dotenv'
import RefreshToken from '~/models/schemas/refreshToken.schema'
config()

// URI kết nối tới MongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@x-api.xy7gt.mongodb.net/?retryWrites=true&w=majority&appName=X-API`

class DatabaseServices {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
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
    return this.db.collection(process.env.DB_USER_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION as string)
  }
}

// Tạo object từ class DatabaseServices
const databaseService = new DatabaseServices()

export default databaseService
