import { MongoClient } from 'mongodb';
import {config} from 'dotenv';
config();

// URI kết nối tới MongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@x-api.xy7gt.mongodb.net/?retryWrites=true&w=majority&appName=X-API`


class DatabaseServices { 
  private client: MongoClient;
  constructor(){
    this.client = new MongoClient(uri);
  }

  async connect(){
    try {
      await this.client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      await this.client.close();
    }
  }
}

// Tạo object từ class DatabaseServices
const databaseService = new DatabaseServices();

export default databaseService;
