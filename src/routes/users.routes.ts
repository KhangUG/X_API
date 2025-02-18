import { error } from 'console'
import { Router } from 'express'
import {
  loginController,
  registerController,
  logoutController,
  verifyEmailController,
  
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  emailVerifyTokenValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * discription: register a new user
 * path: /login
 * method: POST
 * body: { email: string, password: string}
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * discription: register a new user
 * path: /register
 * method: POST
 * body: {name: string, email: string, password: string, confirmpassword: string, dateOfBirth: ISO8601}
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * discription: sigout a new user
 * path: /sigout
 * method: POST
 * headers: {Authorization : Bearer token}
 * body: {refreshToken: string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * discription: sigout a new user
 * path: /sigout
 * method: POST
 * headers: {Authorization : Bearer token}
 * body: {refreshToken: string}
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController as any))


export default usersRouter
