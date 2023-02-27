import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IRole extends Document {
  id: string;
  name: string;
}

export const roleSchema: Schema<IRole> = new Schema(
  {
    name: { type: String, unique: true, default: 'USER' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

export const Role: Model<IRole> = model('role', roleSchema);
