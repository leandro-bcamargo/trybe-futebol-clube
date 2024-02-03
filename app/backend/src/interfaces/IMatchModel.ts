import IMatch from './IMatch';
import IUpdateMatchResult from './IUpdateMatchResult';

export default interface IMatchModel {
  getAll(inProgress?: boolean): Promise<IMatch[]>;
  finishMatch(id: number): Promise<string>;
  updateResult(id: number, { homeTeamGoals, awayTeamGoals }: IUpdateMatchResult):
  Promise<string | null>;
}
