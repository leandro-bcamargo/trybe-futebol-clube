import SequelizeTeamModel from '../database/models/SequelizeTeamModel';
import ITeam from '../interfaces/ITeam';
import ITeamModel from '../interfaces/ITeamModel';

export default class TeamModel implements ITeamModel {
  private model = SequelizeTeamModel;

  public async getAll(): Promise<ITeam[]> {
    const teams = await this.model.findAll();
    return teams;
  }

  public async getById(id: number): Promise<ITeam | null> {
    const team = await this.model.findOne({ where: { id } });
    console.log('teammodel team:', team);
    if (!team) return null;

    return team;
  }
}
