import { Request, Response } from 'express';
import MatchService from '../services/MatchService';
import mapStatusHttp from '../utils/mapStatusHttp';

export default class MatchController {
  constructor(private matchService = new MatchService()) { }

  public async getAll(req: Request, res: Response) {
    const { status, data } = await this.matchService.getAll();

    return res.status(mapStatusHttp(status)).json(data);
  }
}
