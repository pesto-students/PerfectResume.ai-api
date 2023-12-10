import { Inject, Injectable } from '@nestjs/common';
import { UsersQuery } from './users.query';

@Injectable()
export class UsersService {
  @Inject()
  private readonly usersQuery: UsersQuery;

  getUsers() {
    return this.usersQuery.findAll();
  }
}
