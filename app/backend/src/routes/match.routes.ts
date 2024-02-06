import { NextFunction, Request, Response, Router } from 'express';
import MatchController from '../controllers/MatchController';
import TokenValidation from '../middlewares/TokenValidation';
import MatchValidation from '../middlewares/MatchValidation';

const matchController = new MatchController();

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  matchController.getAll(req, res, next));

router.patch(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => TokenValidation.validate(req, res, next),
  (req: Request, res: Response, next: NextFunction) =>
    matchController.updateResult(req, res, next),
);

router.patch(
  '/:id/finish',
  TokenValidation.validate,
  (req: Request, res: Response, next: NextFunction) =>
    matchController.finishMatch(req, res, next),
);

router.post(
  '/',
  TokenValidation.validate,
  MatchValidation.createMatch,
  (req: Request, res: Response, next: NextFunction) => matchController.create(req, res, next),
);

export default router;
