import { Request, Response } from 'express'



export const userController = async (req: Request, res: Response): Promise<void> => {

  const { email, password } = req.body
  if (email == 'giapvankhang6789@gmail.com' && password == '123456') {
    res.status(200).json({ message: 'Success' });
  }else{
  res.status(400).json({
    message: 'email or password is incorrect'
  })
  }
};
