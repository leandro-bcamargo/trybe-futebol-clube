import IUpdateMatchResult from '../interfaces/IUpdateMatchResult';
import IMatch from '../interfaces/IMatch';
import SequelizeMatchModel from '../database/models/SequelizeMatchModel';
import IMatchModel from '../interfaces/IMatchModel';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatchModel;

  public async getAll(inProgress?: boolean): Promise<IMatch[]> {
    let whereCondition = {};
    if (inProgress !== undefined) {
      whereCondition = { inProgress };
    }
    const matches = await this.model.findAll({
      where: whereCondition,
      include: [
        { association: 'homeTeam', attributes: { exclude: ['id'] } },
        { association: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    return matches;
  }

  public async finishMatch(id: number): Promise<string> {
    const match = await this.model.findOne({
      where: { id },
    });
    if (!match) return 'NOT_FOUND';

    const [affectedRows] = await this.model.update(
      { inProgress: false },
      { where: { id } },
    );

    if (!affectedRows) return 'CONFLICT';

    return 'SUCCESSFUL';
  }

  public async updateResult(id: number, { homeTeamGoals, awayTeamGoals }:
  IUpdateMatchResult): Promise<string | null> {
    const [affectedRows] = await this.model.update(
      {
        homeTeamGoals,
        awayTeamGoals,
      },
      { where: { id } },
    );

    if (!affectedRows) return null;

    return 'Match successfully updated!';
  }

  public async create(match: IMatch): Promise<IMatch> {
    const newMatch = await this.model.create(match);

    return newMatch;
  }
}
