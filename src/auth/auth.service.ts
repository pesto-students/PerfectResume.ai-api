import { Injectable, ConflictException } from '@nestjs/common';
import { UsersQuery } from '../users/users.query';
import { JwtService } from './helpers/jwt.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersQuery: UsersQuery,
    private readonly jwtService: JwtService,
  ) {}

  async signup(user: any): Promise<any> {
    const existingUser = await this.usersQuery.findByUsername(user.username);

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const newUser = await this.usersQuery.createUser(user);
    const { username, emailID } = newUser;

    return { username, emailID };
  }

  async login(userInfo: any): Promise<any> {
    // match if user exits and password match
    const user = await this.usersQuery.findOne({
      username: userInfo.username,
      password: userInfo.password,
    });
    if (!user) {
      throw new ConflictException('Incorrect Password or UserName');
    }

    // return accessToken
    const accessToken = await this.jwtService.getAccessToken({
      userID: user.id,
      username: user.username,
    });

    return accessToken;
  }
}
