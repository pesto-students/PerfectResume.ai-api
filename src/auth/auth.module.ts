import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { Users } from '../users/entity/users.schema';
import { JwtService } from './helpers/jwt.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: Users }]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
