import { Inject, Injectable } from '@nestjs/common';
import { UsersQuery } from './entity/users.query';

@Injectable()
export class UsersService {
  @Inject()
  private readonly usersQuery: UsersQuery;

  getUserInfo(_id: string) {
    return this.usersQuery.findById(_id);
  }
}
