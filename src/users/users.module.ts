import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from '../users/users.schema';
import { UsersQuery } from './users.query';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Users', schema: Users }])],
  controllers: [UsersController],
  providers: [UsersService, UsersQuery],
  exports: [UsersQuery],
})
export class UsersModule {}
