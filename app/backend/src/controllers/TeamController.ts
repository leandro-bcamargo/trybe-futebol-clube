import { Request, Response } from 'express';
import mapStatusHttp from '../utils/mapStatusHttp';
import TeamService from '../services/TeamService';

export default class TeamController {
  constructor(private teamService = new TeamService()) {}

  public async getAll(req: Request, res: Response) {
    const { status, data } = await this.teamService.getAll();
    return res.status(mapStatusHttp(status)).json(data);
  }

  public async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { status, data } = await this.teamService.getById(Number(id));
    if (status !== 'SUCCESSFUL') return res.status(mapStatusHttp(status)).json(data);
    return res.status(200).json(data);
  }
}
