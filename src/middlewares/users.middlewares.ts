import { Request, Response, NextFunction } from 'express'
import { check, checkSchema } from 'express-validator'
import { has } from 'lodash'
import { USER_MESSAGE } from '~/constants/message'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'
export const loginValidator = validate(
  checkSchema({
    email: {
      isEmail: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value , password: hashPassword(req.body.password) })
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
  })
)

export const registerValidator = validate(
  checkSchema({
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
  })
)
