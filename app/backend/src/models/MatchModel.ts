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
}
