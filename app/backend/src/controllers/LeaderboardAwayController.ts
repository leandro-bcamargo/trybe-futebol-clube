import { NextFunction, Request, Response } from 'express';
import mapStatusHttp from '../utils/mapStatusHttp';
import LeaderboardAwayService from '../services/LeaderboardAwayService';

export default class LeaderboardAwayController {
  public constructor(private leaderboardAwayService = new LeaderboardAwayService()) {}

  public async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, data } = await this.leaderboardAwayService.getLeaderboard();
      // console.log('leaderboardawaycontroller data:', data);

      return res.status(mapStatusHttp(status)).json(data);
    } catch (error) {
      next(error);
    }
  }
}
