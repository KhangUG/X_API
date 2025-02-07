import { Request, Response, NextFunction } from 'express'
import { check, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
export const loginValidator = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ message: 'miss email or password' })
  }
  next()
}

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
      isEmail: true
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
      },
      
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
          minSymbols: 1,
          
          
        }
      },
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
