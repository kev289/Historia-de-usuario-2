import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '@/interfaces/user.interface';

const UserSchema: Schema = new Schema<IUser>(
  {
    nombre: { type: String, required: true, trim: true },
    cc: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
