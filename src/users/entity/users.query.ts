import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.schema';

@Injectable()
export class UsersQuery {
  constructor(@InjectModel('Users') private readonly userModel: Model<Users>) {}

  async findAll(where: any): Promise<Users[]> {
    return this.userModel.find(where).select('-password').exec();
  }

  async findOne(where: any): Promise<Users | null> {
    return this.userModel.findOne(where).select('-password').exec();
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
}
