import { Injectable, ConflictException } from '@nestjs/common';
import { UsersQuery } from '../users/entity/users.query';
import { JwtService } from './helpers/jwt.helper';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersQuery: UsersQuery,
    private readonly jwtService: JwtService,
  ) {}

  async signup(user: any): Promise<any> {
    console.log(user);
    const existingUser = await this.usersQuery.findOne({
      email: user.email,
    });
    if (existingUser) {
      throw new ConflictException('User with emailID already exists');
    }
    user.username =
      user.email.slice(0, 4) + '_' + randomBytes(5).toString('hex').slice(0, 5);
    const newUser = await this.usersQuery.createUser(user);
    return newUser;
  }

  async login(userInfo: any): Promise<any> {
    // match if user exits and password match
    const user = await this.usersQuery.findOne({
      email: userInfo.email,
      password: userInfo.password,
    });
    if (!user) {
      throw new ConflictException('Incorrect Password or EmailID');
    }

    // return accessToken
    const accessToken = await this.jwtService.getAccessToken({
      userID: user.id,
      username: user.username,
    });

    return {
      accessToken,
      userData: { id: user.id, username: user.username, email: user.email },
    };
  }
}
