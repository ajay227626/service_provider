import mongoose, { Schema, Document } from 'mongoose';

interface Group {
  groupname: string;
  expirydate: Date;
  servicestartdate: Date;
  serviceenddate: Date;
}

export interface UserInterface extends Document {
    contactname: string;
    email: string;
    mobile: string;
    companyname: string;
    whatsappuser: string;
    whatsappapi: string;
    address: string;
    state: string;
    city: string;
    pin: number;
    gstin: string;
    domain: string;
    groupslist: Group[];
}

const Group = new Schema<Group>({
  groupname: { type: String, required: true },
  expirydate: { type: Date, required: false },
  servicestartdate: { type: Date, required: true },
  serviceenddate: { type: Date, required: true },
});

const userSchema: Schema = new Schema(
  {
    contactname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    companyname: { type: String, required: true },
    whatsappuser: { type: String, required: false },
    whatsappapi: { type: String, required: false },
    address: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    pin: { type: Number, required: false },
    gstin: { type: String, required: false },
    domain: { type: String, required: false },
    groupslist: [Group],
  },
  { timestamps: true },
);

const Userinfo = mongoose.model<UserInterface & Document>('userinfo', userSchema);

export default Userinfo;
