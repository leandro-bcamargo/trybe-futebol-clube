import { Request, Response, Router } from 'express';
import MatchController from '../controllers/MatchController';
import TokenValidation from '../middlewares/TokenValidation';

const matchController = new MatchController();

const router = Router();

router.get('/', (req: Request, res: Response) => matchController.getAll(req, res));
router.patch(
  '/:id/finish',
  TokenValidation.validate,
  (req: Request, res: Response) => matchController.finishMatch(req, res),
);

export default router;
