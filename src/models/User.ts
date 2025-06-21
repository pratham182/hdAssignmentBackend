import { Schema, model, Document,Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  password?: string;
  googleAuth?: boolean;
  verified: boolean;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleAuth: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>('User', userSchema);
