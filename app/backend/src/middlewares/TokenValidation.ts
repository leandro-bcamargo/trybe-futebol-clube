import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/CustomError';
import JWT from '../utils/JWT';

export default class TokenValidation {
  public static validate(req: Request, res: Response, next: NextFunction): Response | void {
    try {
      const { authorization: token } = req.headers;
      if (!token) {
        throw new CustomError('UNAUTHORIZED', 'Token not found');
      }
      const payload = JWT.verify(token);

      res.locals.user = payload;

      next();
    } catch (error) {
      next(error);
    }
  }
}
