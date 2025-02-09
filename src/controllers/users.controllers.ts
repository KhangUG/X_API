import { Request, Response } from 'express'
import { registerValidator } from '~/middlewares/users.middlewares'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { Result } from 'express-validator'

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    if (email === 'giapvankhang6789@gmail.com' && password === '123456') {
      res.status(200).json({ message: 'Success' })
    }
    // Nếu thông tin đăng nhập sai, trả về lỗi
    res.status(400).json({ message: 'Email or password is incorrect' })
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về lỗi
    res.status(500).json({ message: 'Internal server error' })
  }
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
