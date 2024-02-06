import IMatch from './IMatch';
import IUpdateMatchResult from './IUpdateMatchResult';
import { ServiceResponseErrorType, ServiceResponseSuccessType } from './ServiceResponse';

export default interface IMatchModel {
  getAll(inProgress?: boolean): Promise<IMatch[]>;
  finishMatch(id: number): Promise<ServiceResponseSuccessType | ServiceResponseErrorType>;
  updateResult(id: number, { homeTeamGoals, awayTeamGoals }: IUpdateMatchResult):
  Promise<string | null>;
  create(match: IMatch): Promise<IMatch | ServiceResponseErrorType>;
}
