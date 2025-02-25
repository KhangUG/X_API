import { Request } from 'express'
import { TokenPayload } from './models/requests/User.requests'

declare module 'express-serve-static-core' {
  interface Request extends ExpressRequest {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
  }
}
