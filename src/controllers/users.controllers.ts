import { Request, Response, NextFunction } from 'express'
import { registerValidator } from '~/middlewares/users.middlewares'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { Result } from 'express-validator'
import { ObjectId } from 'mongodb'

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
