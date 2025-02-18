import e from 'express'
import express from 'express'
import { body, validationResult, ContextRunner, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { httpStatus } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    const errorsObject = errors.mapped()
    console.log(errorsObject)

    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      const error = errorsObject[key]
      if (msg instanceof ErrorWithStatus && msg.status !== httpStatus.unprocessableEntity) {
        return next(msg)
      }
    }
    console.log(errorsObject)

    if (errors.isEmpty()) {
      return next()
    }

    res.status(422).json({ errors: errorsObject })
  }
}
