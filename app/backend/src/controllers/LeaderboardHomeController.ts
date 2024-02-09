import { NextFunction, Request, Response } from 'express';
import mapStatusHttp from '../utils/mapStatusHttp';
import LeaderboardHomeService from '../services/LeaderboardHomeService';

export default class LeaderboardHomeController {
  constructor(private leaderboardHomeService = new LeaderboardHomeService()) {}

  public async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, data } = await this.leaderboardHomeService.getLeaderboard();

      return res.status(mapStatusHttp(status)).json(data);
    } catch (error) {
      next(error);
    }
  }
}
