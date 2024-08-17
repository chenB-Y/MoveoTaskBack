import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  username: string;
  password: string;
  instrument: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  instrument: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>('User', UserSchema);
