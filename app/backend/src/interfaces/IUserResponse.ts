import IUser from './IUser';

export type IUserResponse = Omit<IUser, 'password'>;
