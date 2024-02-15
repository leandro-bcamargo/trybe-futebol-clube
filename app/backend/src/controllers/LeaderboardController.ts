import { NextFunction, Request, Response } from 'express';
import mapStatusHttp from '../utils/mapStatusHttp';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  public async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, data } = await this.leaderboardService.getLeaderboard();

      return res.status(mapStatusHttp(status)).json(data);
    } catch (error) {
      next(error);
    }
  }
}
