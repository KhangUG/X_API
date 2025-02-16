import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { check } from 'express-validator'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { tokenType } from '~/constants/enum'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'

config()

class UsersService {
  // Hàm này sẽ tạo ra một access token và một refresh token
  private sigAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.ACCESS_TOKEN
      },
      options: {
        expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRE_IN as string)
      }
    })
  }
  // Hàm này sẽ tạo ra một refresh token
  private sigRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.REFRESH_TOKEN
      },
      options: {
        expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE_IN as string)
      }
    })
  }

  private sigAccesstokenAndRefreshToken(user_id: string) {
    return Promise.all([this.sigAccessToken(user_id), this.sigRefreshToken(user_id)]) // Gọi hai hàm tạo token ở trên
  }
  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.sigAccesstokenAndRefreshToken(user_id) // Tạo access token và refresh token
    console.log(access_token, refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ _id: new ObjectId(), user_id: new ObjectId(user_id), token: refresh_token })
    ) // Lưu refresh token vào database

    return {
      access_token,
      refresh_token,
      user: {
        ...payload,
        user_id
      }
    } // Trả về thông tin người dùng vừa đăng ký
    
  }
  async checkEmailExist(email: string) {
    // Sử dụng await để đợi kết quả từ findOne
    const user = await databaseService.users.findOne({ email })

    return Boolean(user) // Trả về true nếu tìm thấy người dùng, false nếu không tìm thấy
  }
  async login(user_id: string) {
    const [access_token, refresh_token] = await this.sigAccesstokenAndRefreshToken(user_id) // Tạo access token và refresh token
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ _id: new ObjectId(), user_id: new ObjectId(user_id), token: refresh_token })
    ) // Lưu refresh token vào database
    return {
      access_token,
      refresh_token
    } // Trả về access token và refresh token
  }

  async logout(refreshToken: string) {
    await databaseService.refreshTokens.deleteOne({ token: refreshToken }) // Xóa refresh token khỏi database
    return {
      message: 'Logout success'
    } // Trả về thông báo logout thành công
  }
}




// Tạo một đối tượng mới từ class UsersService
const usersService = new UsersService()
export default usersService

function checkEmailExist(email: any, string: any) {
  throw new Error('Function not implemented.')
}
