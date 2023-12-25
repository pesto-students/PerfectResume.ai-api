import { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export const Users = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

Users.pre('save', async function (next) {
  const user: any = this;

  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

export interface Users extends Document {
  username: string;
  email: string;
  type: string;
  password: string;
  salt: string;
}


export interface LoginUser {
  email: string;
  password: string;
}