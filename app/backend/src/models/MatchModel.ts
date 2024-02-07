import IUpdateMatchResult from '../interfaces/IUpdateMatchResult';
import IMatch from '../interfaces/IMatch';
import SequelizeMatchModel from '../database/models/SequelizeMatchModel';
import IMatchModel from '../interfaces/IMatchModel';
import { ServiceResponseErrorType,
  ServiceResponseSuccessType } from '../interfaces/ServiceResponse';
import SequelizeTeamModel from '../database/models/SequelizeTeamModel';

export default class MatchModel implements IMatchModel {
  private matchModel = SequelizeMatchModel;
  private teamModel = SequelizeTeamModel;

  public async getAll(inProgress?: boolean): Promise<IMatch[]> {
    let whereCondition = {};
    if (inProgress !== undefined) {
      whereCondition = { inProgress };
    }
    const matches = await this.matchModel.findAll({
      where: whereCondition,
      include: [
        { association: 'homeTeam', attributes: { exclude: ['id'] } },
        { association: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }

  public async finishMatch(id: number):
  Promise<ServiceResponseErrorType | ServiceResponseSuccessType> {
    const match = await this.matchModel.findOne({
      where: { id },
    });
    if (!match) return 'NOT_FOUND';

    const [affectedRows] = await this.matchModel.update(
      { inProgress: false },
      { where: { id } },
    );

    if (!affectedRows) return 'CONFLICT';

    return 'SUCCESSFUL';
  }

  public async updateResult(id: number, { homeTeamGoals, awayTeamGoals }:
  IUpdateMatchResult): Promise<string | null> {
    const [affectedRows] = await this.matchModel.update(
      {
        homeTeamGoals,
        awayTeamGoals,
      },
      { where: { id } },
    );

    if (!affectedRows) return null;

    return 'Match successfully updated!';
  }

  public async create(match: IMatch): Promise<IMatch | ServiceResponseErrorType> {
    const { homeTeamId, awayTeamId } = match;
    const homeTeam = await this.teamModel.findOne({ where: { id: homeTeamId } });
    const awayTeam = await this.teamModel.findOne({ where: { id: awayTeamId } });

    if (!homeTeam || !awayTeam) return 'NOT_FOUND';

    const newMatch = await this.matchModel.create(match);

    return newMatch;
  }
}
