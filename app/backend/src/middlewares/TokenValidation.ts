import { NextFunction, Request, Response } from 'express';
import JWT from '../utils/JWT';

export default class TokenValidation {
  public static validate(req: Request, res: Response, next: NextFunction): Response | void {
    const { authorization: token } = req.headers;
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }
    const payload = JWT.verify(token);
    if (payload === 'Token must be a valid token') {
      return res.status(401).json({ message: payload });
    }
    res.locals.user = payload;

    next();
  }
}
