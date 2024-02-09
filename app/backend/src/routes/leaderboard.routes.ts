import { NextFunction, Request, Response, Router } from 'express';
import LeaderboardHomeController from '../controllers/LeaderboardHomeController';

const leaderboardHomeController = new LeaderboardHomeController();

const router = Router();

router.get('/home', (req: Request, res: Response, next: NextFunction) =>
  leaderboardHomeController.getLeaderboard(req, res, next));

export default router;
