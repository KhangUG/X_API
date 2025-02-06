import { Router } from 'express';
import { userController } from '~/controllers/users.controllers';
import { loginValidator } from '~/middlewares/users.middlewares';

const usersRouter = Router();

usersRouter.post('/login', loginValidator, userController);

export default usersRouter;
