import mongoose, { Schema, Document } from 'mongoose';

export interface UserInterface {
  fullName: string;
  email: string;
  password: string;
  photo: string;
  role: string;
  department: string;
  phone: string;
  otp: string;
  ttl: Date;
}

const userSchema: Schema = new Schema(
  {
    fullName: { type: String, required: false, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin', 'minion'], default: 'user' },
    department: { type: String, required: false, default: '' },
    phone: { type: String, default: '' },
    otp: { type: String, default: '' },
    ttl: { type: Date, default: Date.now, expires: '5m' },
  },
  { timestamps: true },
);

const User = mongoose.model<UserInterface & Document>('user', userSchema);

export default User;
