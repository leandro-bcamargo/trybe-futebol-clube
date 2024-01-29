import { Request, Response, Router } from 'express';
import UserController from '../controllers/UserController';
import LoginValidation from '../middlewares/LoginValidation';
import TokenValidation from '../middlewares/TokenValidation';

const userController = new UserController();

const router = Router();

router.post(
  '/',
  LoginValidation.validate,
  (req: Request, res: Response) => userController.login(req, res),
);

router.get(
  '/role',
  TokenValidation.validate,
  (req: Request, res: Response) => userController.getRole(req, res),
);

export default router;
