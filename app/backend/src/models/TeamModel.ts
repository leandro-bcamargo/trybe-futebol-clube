import SequelizeTeamModel from "../database/models/SequelizeTeamModel"
import ITeam from "../interfaces/ITeam";
import ITeamModel from "../interfaces/ITeamModel";

export default class TeamModel implements ITeamModel {
  private model = SequelizeTeamModel;

  public async getAll(): Promise<ITeam[]> {
    const teams = await this.model.findAll();

    return teams;
  }
}