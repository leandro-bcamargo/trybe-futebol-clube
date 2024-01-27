import IUser from './IUser';

export default interface IUserModel {
  getByEmail(email: string): Promise<IUser | null>;
}
