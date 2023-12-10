import { Schema, Document } from 'mongoose';

export const Users = new Schema({
  username: String,
  emailID: String,
  type: String,
  password: String,
});

export interface Users extends Document {
  username: string;
  emailID: string;
  type: string;
  password: string;
}
