import { NextFunction, Request, Response, Router } from 'express';
import LeaderboardHomeController from '../controllers/LeaderboardHomeController';
import LeaderboardAwayController from '../controllers/LeaderboardAwayController';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();
const leaderboardHomeController = new LeaderboardHomeController();
const leaderboardAwayController = new LeaderboardAwayController();

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  leaderboardController.getLeaderboard(req, res, next));

router.get('/home', (req: Request, res: Response, next: NextFunction) =>
  leaderboardHomeController.getLeaderboard(req, res, next));

router.get('/away', (req: Request, res: Response, next: NextFunction) =>
  leaderboardAwayController.getLeaderboard(req, res, next));

export default router;
