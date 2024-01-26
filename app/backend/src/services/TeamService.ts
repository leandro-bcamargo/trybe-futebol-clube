import TeamModel from '../models/TeamModel';
import ITeam from '../interfaces/ITeam';
import ITeamModel from '../interfaces/ITeamModel';
import { ServiceResponse } from '../interfaces/ServiceResponse';

export default class TeamService {
  constructor(private teamModel: ITeamModel = new TeamModel()) {}

  public async getAll(): Promise<ServiceResponse<ITeam[]>> {
    const teams = await this.teamModel.getAll();

    return { status: 'SUCCESSFUL', data: teams };
  }

  public async getById(id: number): Promise<ServiceResponse<ITeam | null>> {
    const team = await this.teamModel.getById(id);

    if (!team) {
      return { status: 'NOT_FOUND',
        data:
    { message: `A team with id ${id} hasn't been found` } };
    }

    return { status: 'SUCCESSFUL', data: team };
  }
}
