import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/CustomError';
import mapStatusHttp from '../utils/mapStatusHttp';

export default class ErrorMiddleware {
  public static error(err: Error, req: Request, res: Response, _next: NextFunction) {
    if (err instanceof CustomError) {
      const { status, message } = err;
      return res.status(mapStatusHttp(status)).json({ message });
    }
    return res.status(500).json({ message: err.message });
  }
}
