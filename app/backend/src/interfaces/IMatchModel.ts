import IMatch from './IMatch';

export default interface IMatchModel {
  getAll(inProgress?: boolean): Promise<IMatch[]>;
}
