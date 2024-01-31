import IMatch from '../interfaces/IMatch';
import IMatchModel from '../interfaces/IMatchModel';
import { ServiceResponse } from '../interfaces/ServiceResponse';
import MatchModel from '../models/MatchModel';

export default class MatchService {
  constructor(private matchModel: IMatchModel = new MatchModel()) { }

  public async getAll(inProgress?: boolean): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.getAll(inProgress);

    return { status: 'SUCCESSFUL', data: matches };
  }
}
