import mapStatusHttp from "../utils/mapStatusHttp";
import TeamService from "../services/TeamService";
import { Request, Response } from "express";

export default class TeamController {
  constructor(private teamService = new TeamService()) {}

  public async getAll(req: Request, res: Response) {
    const {status, data} = await this.teamService.getAll();
    return res.status(mapStatusHttp(status)).json(data);
  }
}