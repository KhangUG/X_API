import { error } from 'console'
import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)

/**
 * discription: register a new user
 * path: /register
 * method: POST
 * body: {name: string, email: string, password: string, confirmpassword: string, dateOfBirth: ISO8601}
 */
usersRouter.post('/register', registerValidator, wrapAsync(registerController))

export default usersRouter
