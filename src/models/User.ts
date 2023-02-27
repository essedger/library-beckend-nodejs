import { Schema, model, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  roles: string[];
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: [{ type: String, ref: 'Role' }],
});

const User: Model<IUser> = model('User', userSchema);

export default User;
