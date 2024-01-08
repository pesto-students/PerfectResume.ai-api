import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entity/users.schema';
import { UsersQuery } from './entity/users.query';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Users', schema: Users }])],
  controllers: [UsersController],
  providers: [UsersService, UsersQuery],
  exports: [UsersQuery],
})
export class UsersModule {}
