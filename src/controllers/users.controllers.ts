import { Request, Response, NextFunction } from 'express'
import { registerValidator } from '~/middlewares/users.middlewares'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { LogoutReqBody, RegisterReqBody, TokenPayload } from '~/models/requests/User.requests'
import { Result } from 'express-validator'
import { ObjectId } from 'mongodb'
import { httpStatus } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())
  res.json({
    message: 'Login success',
    result
  })
  console.log(result)
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  // throw new Error('Function not implemented.')
  const result = await usersService.register(req.body)
  res.status(200).json({
    message: 'Register success'
  })
  console.log(result)
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refreshToken } = req.body
  const result = await usersService.logout(refreshToken)
  res.json(result)
}


export const verifyEmailController = (handler: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { user_id } = req.decoded_email_verify_token as TokenPayload
      const user = await databaseService.users.findOne({
        _id: new ObjectId(user_id)
      })
      // Nếu không tìm thấy user thì mình sẽ báo lỗi
      if (!user) {
        return res.status(httpStatus.notFound).json({
          message: USER_MESSAGE.USER_NOT_FOUND
        })
      }
      // Đã verify rồi thì mình sẽ không báo lỗi
      // Mà mình sẽ trả về status OK với message là đã verify trước đó rồi
      if (user.email_verify_token === '') {
        return res.json({
          message: USER_MESSAGE.EMAIL_ALREADY_VERIFED_BEFORE
        })
      }
      const result = await usersService.verifyEmail(user_id)
      return res.json({
        message: USER_MESSAGE.EMAIL_VERIFY_SUCCESS,
        result
      })
    } catch (error) {
      next(error)
    }
  }
}
