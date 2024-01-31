import { Request, Response } from 'express';
import MatchService from '../services/MatchService';
import mapStatusHttp from '../utils/mapStatusHttp';

export default class MatchController {
  constructor(private matchService = new MatchService()) { }

  public async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    let isInProgress;
    if (inProgress !== undefined) {
      isInProgress = inProgress === 'true';
    }
    const { status, data } = await this.matchService.getAll(isInProgress);
    return res.status(mapStatusHttp(status)).json(data);
  }
}
