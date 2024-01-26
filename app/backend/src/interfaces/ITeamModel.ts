import ITeam from './ITeam';

export default interface ITeamModel {
  getAll(): Promise<ITeam[]>;
  getById(id: ITeam['id']): Promise<ITeam | null>;
}
