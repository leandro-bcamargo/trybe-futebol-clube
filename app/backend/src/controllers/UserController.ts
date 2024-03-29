import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHttp from '../utils/mapStatusHttp';

export default class UserController {
  constructor(private userService = new UserService()) { }

  public async login(req: Request, res: Response, next: NextFunction):
  Promise<Response | undefined> {
    try {
      const { email, password } = req.body;
      const { status, data } = await this.userService.login({ email, password });
      if (status !== 'SUCCESSFUL') {
        return res.status(mapStatusHttp(status)).json(data);
      }
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  public async getRole(req: Request, res: Response, next: NextFunction):
  Promise<Response | undefined> {
    try {
      const { status, data } = await this.userService.getRole(res);
      if (status !== 'SUCCESSFUL') {
        return res.status(mapStatusHttp(status)).json(data);
      }
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
