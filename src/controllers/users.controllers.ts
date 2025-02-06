import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email == 'giapvankhang6789@gmail.com' && password == '123456') {
    res.status(200).json({ message: 'Success' })
  } else {
    res.status(400).json({
      message: 'email or password is incorrect'
    })
  }
}

export const registerController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  try {
    const result= await  usersService.register({ email, password })
    res.status(200).json({
      message: 'Register success'
    })
    console.log(result)
  } catch (error) {
    res.status(400).json({
      message: 'Register fail'
    })
  }
}
