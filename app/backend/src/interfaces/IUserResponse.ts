import IUser from './IUser';

export type TUserResponse = Omit<IUser, 'password'>;
