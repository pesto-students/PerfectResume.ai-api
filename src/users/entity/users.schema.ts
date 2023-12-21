import { Schema, Document } from 'mongoose';

export const Users = new Schema({
  username: String,
  email: String,
  type: String,
  password: String,
});

export interface Users extends Document {
  username: string;
  email: string;
  type: string;
  password: string;
}
