import { NextFunction, Request, Response, Router } from 'express';
import TeamController from '../controllers/TeamController';

const teamController = new TeamController();

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  teamController.getAll(req, res, next));

router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
  teamController.getById(req, res, next));

export default router;
