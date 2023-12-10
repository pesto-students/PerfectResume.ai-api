import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor() {}

  private getJwtSecretToken() {
    return process.env.JWT_SECRET_TOKEN;
  }

  async getAccessToken(userInfo: any) {
    const secret = this.getJwtSecretToken();
    return sign(userInfo, secret, { expiresIn: '3d' });
  }
}
