import { Schema, model, Document, Model } from 'mongoose';
import { IUser, userSchema } from './User';

export interface IBook extends Document {
  id: string;
  name: string;
  author: string;
  date_end: string;
  date_start: string;
  description: string;
  device: string;
  image: string;
  is_deleted: boolean;
  is_read: boolean;
  link: string;
  notes: string;
  rating: number;
  schedule: string;
  source: string;
  type: string;
  genre: string;
  owner: IUser;
}

export const bookSchema: Schema<IBook> = new Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    date_end: { type: String },
    date_start: { type: String },
    description: { type: String },
    device: { type: String },
    image: { type: String },
    is_deleted: { type: Boolean, default: false },
    is_read: { type: Boolean, default: false },
    link: { type: String },
    notes: { type: String },
    rating: { type: Number },
    schedule: { type: String },
    source: { type: String },
    type: { type: String },
    genre: { type: String },
    owner: userSchema,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const Book: Model<IBook> = model('book', bookSchema);

export default Book;
