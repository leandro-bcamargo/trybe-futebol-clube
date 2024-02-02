import CustomError from '../utils/CustomError';
import IMatch from '../interfaces/IMatch';
import IMatchModel from '../interfaces/IMatchModel';
import { ServiceMessage, ServiceResponse } from '../interfaces/ServiceResponse';
import MatchModel from '../models/MatchModel';

export default class MatchService {
  constructor(private matchModel: IMatchModel = new MatchModel()) { }

  public async getAll(inProgress?: boolean): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.getAll(inProgress);

    return { status: 'SUCCESSFUL', data: matches };
  }

  public async finishMatch(id: number): Promise<ServiceResponse<ServiceMessage>> {
    const finished = await this.matchModel.finishMatch(id);
    console.log('match service finished:', finished);

    if (finished === 'NOT FOUND') throw new CustomError('NOT_FOUND', 'Match not found');

    if (finished === 'CONFLICT') throw new CustomError('CONFLICT', 'The match is already finished');

    return { status: 'SUCCESSFUL', data: { message: finished } };
  }
}
