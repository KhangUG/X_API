import { config } from 'dotenv'
import { Request, Response, NextFunction, RequestHandler } from 'express'

config()
export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error) 
    }
  }
}
