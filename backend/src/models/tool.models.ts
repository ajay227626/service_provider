import { Schema, Document, model } from 'mongoose';

// Define an interface for the Tool document
interface ToolInterface extends Document {
  toolName: string;
  testerId?: string;
}

// Define the schema
const toolSchema: Schema<ToolInterface> = new Schema(
  {
    toolName: { type: String, required: true, default: '' },
    testerId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: false,
      default: '',
    },
  },
  { timestamps: true },
);

// Define and export the model
const ToolModel = model<ToolInterface>('Tool', toolSchema);

export default ToolModel;
export type { ToolInterface };
