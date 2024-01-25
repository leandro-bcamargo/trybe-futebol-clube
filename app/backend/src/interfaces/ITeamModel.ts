import ITeam from "./ITeam";

export default interface ITeamModel {
  getAll(): Promise<ITeam[]>;
}