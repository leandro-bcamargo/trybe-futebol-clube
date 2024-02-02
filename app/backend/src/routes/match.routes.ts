import { NextFunction, Request, Response, Router } from 'express';
import MatchController from '../controllers/MatchController';
import TokenValidation from '../middlewares/TokenValidation';

const matchController = new MatchController();

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  matchController.getAll(req, res, next));

router.patch(
  '/:id/finish',
  TokenValidation.validate,
  (req: Request, res: Response, next: NextFunction) =>
    matchController.finishMatch(req, res, next),
);

export default router;
