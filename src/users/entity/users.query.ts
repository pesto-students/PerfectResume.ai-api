import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginUser, Users } from './users.schema';

@Injectable()
export class UsersQuery {
  constructor(@InjectModel('Users') private readonly userModel: Model<Users>) {}

  async findAll(where: any): Promise<Users[]> {
    return this.userModel.find(where).select('-password').exec();
  }

  async findOne(where: any): Promise<Users | null> {
    return this.userModel.findOne(where).exec();
  }

  async findByUsername(username: string): Promise<Users | null> {
    return this.userModel.findOne({ username }).select('-password').exec();
  }

  async findById(id: string): Promise<Users | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async createUser(user: Users): Promise<Users> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async comparePasswords(user: Users, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async validateUser(loginUser: LoginUser): Promise<Users> {
    const user = await this.findOne({ email: loginUser.email });

    if (user && (await this.comparePasswords(user, loginUser.password))) {
      return user;
    }

    throw new ConflictException('Incorrect Password or EmailID');
  }
}
