import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserData } from 'src/decorator/request.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUserInfo(@UserData('userID') userID: string): Promise<any> {
    return this.usersService.getUserInfo(userID);
  }
}
