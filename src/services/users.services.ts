import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { check } from 'express-validator'

class UsersService {
  async register(payload: { email: string; password: string }) {
    const result = await databaseService.users.insertOne(
      new User({
        email: payload.email,
        password: payload.password
      })
    )
    return result
  }
  async checkEmailExist(email: string) {
    // Sử dụng await để đợi kết quả từ findOne
    const user = await databaseService.users.findOne({ email });
    console.log(user);
    return Boolean(user); // Trả về true nếu tìm thấy người dùng, false nếu không tìm thấy
  }
  
}

const usersService = new UsersService()
export default usersService

function checkEmailExist(email: any, string: any) {
  throw new Error('Function not implemented.')
}
