import { Injectable, ConflictException } from '@nestjs/common';
import { UsersQuery } from '../users/entity/users.query';
import { JwtService } from './helpers/jwt.helper';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entity/users.schema';
import { UserSignupDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersQuery: UsersQuery,
    private readonly jwtService: JwtService,
  ) {}

  private async buildNewUser(user: UserSignupDTO): Promise<Users> {
    const newUser = {} as Users;

    newUser.email = user.email;
    newUser.userType = user.userType;
    // create a new username
    newUser.username =
      user.email.slice(0, 4) + '_' + randomBytes(5).toString('hex').slice(0, 5);
    // hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(user.password, salt);

    return newUser;
  }

  async signup(user: UserSignupDTO): Promise<any> {
    const existingUser = await this.usersQuery.findOne({
      email: user.email,
    });
    if (existingUser) {
      throw new ConflictException('User with emailID already exists');
    }

    const newUser = await this.buildNewUser(user);
    return this.usersQuery.createUser(newUser);
  }

  async login(userInfo: any): Promise<any> {
    // match if user exits and password match
    const user = await this.usersQuery.validateUser(userInfo);
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
