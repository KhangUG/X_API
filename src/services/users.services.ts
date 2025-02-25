import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { USERS_MESSAGES } from '~/constants/messages'
config()

class UsersService {
  // Hàm này sẽ tạo ra một access token và một refresh token
  private sigAccessToken(user_id: string) {
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRE_IN as string | undefined
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: expiresIn as unknown as number | undefined
      }
    })
  }
  private signForgotPasswordToken(user_id: string) {
    const expiresIn = process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string | undefined
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: expiresIn as unknown as number | undefined
      }
    })
  }
  // Hàm này sẽ tạo ra một refresh token
  private sigRefreshToken(user_id: string) {
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRE_IN as string | undefined
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: expiresIn as unknown as number | undefined
      }
    })
  }

  private signEmailVerifyToken(user_id: string) {
    const expiresIn = process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN as string | undefined
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: expiresIn as unknown as number | undefined
      }
    })
  }

  private sigAccesstokenAndRefreshToken(user_id: string) {
    return Promise.all([this.sigAccessToken(user_id), this.sigRefreshToken(user_id)]) // Gọi hai hàm tạo token ở trên
  }
  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId().toString()
    const email_verify_token = await this.signEmailVerifyToken(user_id) // Tạo email verify token
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: new ObjectId(user_id),
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const [access_token, refresh_token] = await this.sigAccesstokenAndRefreshToken(user_id) // Tạo access token và refresh token
    console.log(access_token, refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ _id: new ObjectId(), user_id: new ObjectId(user_id), token: refresh_token })
    ) // Lưu refresh token vào database
    console.log('email_verify_token: ', email_verify_token)
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

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.sigAccesstokenAndRefreshToken(user_id),
      databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
        {
          $set: {
            email_verify_token: '',
            updated_at: '$$NOW'
          }
        }
      ])
    ])
    const [access_token, refresh_token] = token
    return {
      access_token,
      refresh_token
    }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id)
    // Gỉa bộ gửi email
    console.log('Rensend verify email: ', email_verify_token)

    // Cập nhật lại giá trị email_verify_token trong document user
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    }
  }
  async forgotPassword(user_id: string) {
    const forgot_password_token = await this.signForgotPasswordToken(user_id)
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ])
    // Gửi email kèm đường link đến email người dùng: https://twitter.com/forgot-password?token=token
    console.log('forgot_password_token: ', forgot_password_token)
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }
}

// Tạo một đối tượng mới từ class UsersService
const usersService = new UsersService()
export default usersService

function checkEmailExist(email: any, string: any) {
  throw new Error('Function not implemented.')
}
