import IUser from '../interfaces/IUser';
import IUserModel from '../interfaces/IUserModel';
import SequelizeUserModel from '../database/models/SequelizeUserModel';

export default class UserModel implements IUserModel {
  private model = SequelizeUserModel;

  public async getByEmail(email: string): Promise<IUser | null> {
    const user = await this.model.findOne({ where: { email } });
    if (!user) return null;

    return user;
  }
}
