import CustomError from '../utils/CustomError';
import IMatch from '../interfaces/IMatch';
import IMatchModel from '../interfaces/IMatchModel';
import { ServiceMessage, ServiceResponse } from '../interfaces/ServiceResponse';
import MatchModel from '../models/MatchModel';
import IUpdateMatchResult from '../interfaces/IUpdateMatchResult';

export default class MatchService {
  constructor(private matchModel: IMatchModel = new MatchModel()) { }

  public async getAll(inProgress?: boolean): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.getAll(inProgress);

    return { status: 'SUCCESSFUL', data: matches };
  }

  public async finishMatch(id: number): Promise<ServiceResponse<ServiceMessage>> {
    const finished = await this.matchModel.finishMatch(id);
    // console.log('match service finished:', finished);

    if (finished === 'NOT FOUND') throw new CustomError('NOT_FOUND', 'Match not found');

    if (finished === 'CONFLICT') throw new CustomError('CONFLICT', 'The match is already finished');

    return { status: 'SUCCESSFUL', data: { message: finished } };
  }

  public async updateResult(id: number, { homeTeamGoals, awayTeamGoals }:
  IUpdateMatchResult): Promise<ServiceResponse<ServiceMessage>> {
    const updated = await this.matchModel.updateResult(id, { homeTeamGoals, awayTeamGoals });

    if (!updated) throw new CustomError('NOT_FOUND', 'Match not found');

    return { status: 'SUCCESSFUL', data: { message: updated } };
  }
}
