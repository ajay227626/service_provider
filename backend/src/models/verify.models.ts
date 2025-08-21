import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  userId: mongoose.Types.ObjectId;
  otp: string;
  expiresAt: Date;
}

const otpSchema: Schema<IOtp> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 300000 } } 
  // expireAfterSeconds: 300000 means MongoDB will auto delete the doc after 5 minutes
});

const Otp = mongoose.model<IOtp>("Otp", otpSchema);

export default Otp;