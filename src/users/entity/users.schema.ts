import { Schema, Document } from 'mongoose';

export const Users = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['NORMAL', 'MEMBER'],
      default: 'NORMAL',
    },
  },
  {
    timestamps: true,
  },
);

export interface Users extends Document {
  username: string;
  email: string;
  userType: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}
