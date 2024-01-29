import * as bcrypt from 'bcryptjs';
import { ServiceResponse, ServiceMessage } from '../interfaces/ServiceResponse';
import IToken from '../interfaces/IToken';
import JWT from '../utils/JWT';
import UserModel from '../models/UserModel';
import ILogin from '../interfaces/ILogin';

export default class UserService {
  constructor(private userModel = new UserModel(), private jwtService = JWT) { }

  public async login({ email, password }: ILogin):
  Promise<ServiceResponse<IToken | ServiceMessage>> {
    const user = await this.userModel.getByEmail(email);

    if (!user) {
      return {
        status: 'UNAUTHORIZED',
        data: { message: 'Invalid email or password' },
      };
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const token = this.jwtService.sign({ email });

    return { status: 'SUCCESSFUL', data: { token } };
  }
}
