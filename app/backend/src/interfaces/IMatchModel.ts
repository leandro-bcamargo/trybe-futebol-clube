import IMatch from './IMatch';

export default interface IMatchModel {
  getAll(): Promise<IMatch[]>
}
