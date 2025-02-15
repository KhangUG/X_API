import { verify } from 'crypto'
import { Request, Response, NextFunction } from 'express'
import { check, checkSchema } from 'express-validator'
import { has } from 'lodash'
import { httpStatus } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new Error(USER_MESSAGE.EMAIL_OR_PASSWORD_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      },

      password: {
        isString: true,
        notEmpty: true,
        isLength: {
          errorMessage: 'password should be at least 6 chars long',
          options: { min: 6 }
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          }
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: true,
        isString: true,
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          }
        }
      },
      email: {
        notEmpty: true,
        isEmail: true,
        custom: {
          options: async (value) => {
            const isExistEmail = await usersService.checkEmailExist(value)
            if (isExistEmail) {
              throw new Error('email already exist')
            }
            return true
          }
        }
      },

      password: {
        isString: true,
        notEmpty: true,
        isLength: {
          errorMessage: 'password should be at least 6 chars long',
          options: { min: 6 }
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          }
        }
      },

      confirm_password: {
        isString: true,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('passwords do not match')
            }
            return true
          }
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          }
        }
      },

      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        notEmpty: {
          errorMessage: 'missing authorization header'
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            console.log('access_tokens', access_token)
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
                status: httpStatus.unauthorized
              })
            }
            const decoded_authorization = await verifyToken({ token: access_token })
            
            console.log('decoded_authorization', decoded_authorization)
            const user = await databaseService.users.findOne({ access_token })

            req.decoded_authorization = decoded_authorization
            return true
          }
        }
      }
    },
    ['headers']
  )
)
