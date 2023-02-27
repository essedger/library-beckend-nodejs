import { Schema, model, Document, Model } from 'mongoose';

export interface IRole extends Document {
  value: string;
}

const roleSchema: Schema<IRole> = new Schema({
  value: { type: String, unique: true, default: 'USER' },
});

const Role: Model<IRole> = model('Role', roleSchema);

export default Role;
