import { NextFunction, Request, Response } from 'express';
import MatchService from '../services/MatchService';
import mapStatusHttp from '../utils/mapStatusHttp';

export default class MatchController {
  constructor(private matchService = new MatchService()) { }

  public async getAll(req: Request, res: Response, next: NextFunction):
  Promise<Response | undefined> {
    try {
      const { inProgress } = req.query;
      let isInProgress;
      if (inProgress !== undefined) {
        isInProgress = inProgress === 'true';
      }
      const { status, data } = await this.matchService.getAll(isInProgress);
      return res.status(mapStatusHttp(status)).json(data);
    } catch (error) {
      // console.log('match controller error:', error);
      next(error);
    }
  }

  public async finishMatch(req: Request, res: Response, next: NextFunction):
  Promise<Response | undefined> {
    try {
      const { id } = req.params;
      const { status, data } = await this.matchService.finishMatch(Number(id));

      return res.status(mapStatusHttp(status)).json(data);
    } catch (error) {
      next(error);
    }
  }

  public async updateResult(req: Request, res: Response, next: NextFunction):
  Promise<Response | undefined> {
    try {
      const { id } = req.params;
      const { homeTeamGoals, awayTeamGoals } = req.body;
      const { status, data } = await this.matchService
        .updateResult(Number(id), { homeTeamGoals, awayTeamGoals });

      return res.status(mapStatusHttp(status)).json(data);
    } catch (error) {
      next(error);
    }
  }
}
