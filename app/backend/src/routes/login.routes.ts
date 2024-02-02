import { NextFunction, Request, Response, Router } from 'express';
import UserController from '../controllers/UserController';
import LoginValidation from '../middlewares/LoginValidation';
import TokenValidation from '../middlewares/TokenValidation';

const userController = new UserController();

const router = Router();

router.post(
  '/',
  (req: Request, res: Response, next: NextFunction) => LoginValidation.validate(req, res, next),
  (req: Request, res: Response, next: NextFunction) => userController.login(req, res, next),
);

router.get(
  '/role',
  TokenValidation.validate,
  (req: Request, res: Response, next: NextFunction) => userController.getRole(req, res, next),
);

export default router;
