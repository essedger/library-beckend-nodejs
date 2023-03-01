import { Schema, model, Document, Model, Types } from 'mongoose';
import { IRole, roleSchema } from './Role';

export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  age: number;
  timezone: string;
  image: string;
  confirmed: boolean;
  phone: string;
  country: string;
  city: string;
  disabled: boolean;
  is_deleted: boolean;
  roles: IRole;
  favorite_books?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number },
    timezone: { type: String },
    image: { type: String },
    confirmed: { type: Boolean },
    phone: { type: String },
    country: { type: String },
    city: { type: String },
    disabled: { type: Boolean },
    is_deleted: { type: Boolean },
    roles: [roleSchema],
    favorite_books: [{ type: Types.ObjectId, ref: 'Book' }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const User: Model<IUser> = model('user', userSchema);

export default User;
