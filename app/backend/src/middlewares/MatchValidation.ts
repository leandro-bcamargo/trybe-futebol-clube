import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/CustomError';

export default class MatchValidation {
  public static createMatch = (req: Request, res: Response, next: NextFunction) => {
    const { homeTeamId, awayTeamId } = req.body;
    if (homeTeamId === awayTeamId) {
      throw new CustomError(
        'UNPROCESSABLE',
        'It is not possible to create a match with two equal teams',
      );
    }
    next();
  };
}
