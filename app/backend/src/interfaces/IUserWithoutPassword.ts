import IUser from './IUser';

export type IUserWithoutPassword = Omit<IUser, 'password'>;
