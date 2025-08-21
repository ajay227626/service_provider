import { Schema, Document, model } from 'mongoose';

interface ToolEntry {
  toolId: string;
  license_version: string;
  allowed_credit: number;
}

export interface GroupInterface extends Document {
  name: string;
  subscription_validity: Date;
  group_validity: Date;
  alias: string;
  tools: ToolEntry[];
}

const toolSchema = new Schema<ToolEntry>({
  toolId: { type: String, required: true },
  license_version: { type: String, required: true },
  allowed_credit: { type: Number, required: true, default: 0 },
});

const groupSchema = new Schema<GroupInterface>({
  name: { type: String, required: true },
  subscription_validity: { type: Date, required: true },
  group_validity: { type: Date, required: true },
  alias: { type: String, required: true },
  tools: [toolSchema],
});

const Group = model<GroupInterface>('Group', groupSchema);

export default Group;

