import { Request, Response } from 'express'

export const userController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email == 'giapvankhang6789@gmail.com' && password == '123456') {
    res.json({
      message: 'Login successful'
    })
  }
  return res.status(400).json({
    message: 'email or password is incorrect'
  })
  
}
