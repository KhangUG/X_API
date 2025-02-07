import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)

/**
 * discription: register a new user
 * path: /register
 * method: POST
 * body: {name: string, email: string, password: string, confirmpassword: string, dateOfBirth: ISO8601}
 */
usersRouter.post('/register', registerValidator, registerController)

export default usersRouter
