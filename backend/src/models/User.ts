import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'admin' | 'user';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends Omit<IUser, '_id'>, Document {}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export const User = mongoose.model<UserDocument>('User', userSchema);
