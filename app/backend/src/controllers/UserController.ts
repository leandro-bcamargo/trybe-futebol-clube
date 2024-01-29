import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHttp from '../utils/mapStatusHttp';

export default class UserController {
  constructor(private userService = new UserService()) {}

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const { status, data } = await this.userService.login({ email, password });
    if (status !== 'SUCCESSFUL') {
      return res.status(mapStatusHttp(status)).json(data);
    }
    return res.status(200).json(data);
  }

  public async getRole(req: Request, res: Response): Promise<Response> {
    const { status, data } = await this.userService.getRole(res);
    if (status !== 'SUCCESSFUL') {
      return res.status(mapStatusHttp(status)).json(data);
    }
    return res.status(200).json(data);
  }
}
