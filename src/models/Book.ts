import { Schema, model, Document, Model, Types } from 'mongoose';
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
  link: string;
  notes: string;
  rating: number;
  schedule: string;
  source: string;
  type: string;
  genre: string;
  year: number;
  language: string;
  owner: IUser;
  favoritedBy: Types.Array<IUser['id']>;
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
    link: { type: String },
    notes: { type: String },
    rating: { type: Number },
    schedule: { type: String },
    source: { type: String },
    type: { type: String },
    genre: { type: String },
    year: { type: Number },
    language: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'user' },
    favoritedBy: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const Book: Model<IBook> = model('book', bookSchema);

export default Book;
