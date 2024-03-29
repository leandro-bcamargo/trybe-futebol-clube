import { JwtPayload, SignOptions, sign, verify } from 'jsonwebtoken';
import CustomError from './CustomError';

export default class JWT {
  private static secret = process.env.JWT_SECRET || 'secret';

  private static jwtConfig: SignOptions = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };

  public static sign(payload: JwtPayload): string {
    return sign(payload, this.secret, this.jwtConfig);
  }

  public static verify(token: string): JwtPayload | string {
    try {
      return verify(token, this.secret) as JwtPayload;
    } catch (error) {
      throw new CustomError('UNAUTHORIZED', 'Token must be a valid token');
    }
  }
}
