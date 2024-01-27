import { Request, Response, Router } from 'express';
import UserController from '../controllers/UserController';
import LoginValidation from '../middlewares/LoginValidation';

const userController = new UserController();

const router = Router();

router.post(
  '/',
  LoginValidation.validate,
  (req: Request, res: Response) => userController.login(req, res),
);

export default router;
