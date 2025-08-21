import { Schema, Document, model } from 'mongoose';

// Define an interface for the Tool document
interface ToolInterface extends Document {
  toolId: string;                // Tool ID
  licenseVersion: string;        // License Version
  licenseExpiry: Date;           // License Expiry
  licenseType: string;           // License Type
  description?: string;          // Description (optional)
  lastUpdateDate: Date;          // Last Update Date
  version: string;               // Version
  notes?: string;                // Notes (optional)
  // testerId?: string;             // Reference to user (optional)
}

// Define the schema
const toolSchema: Schema<ToolInterface> = new Schema(
  {
    toolId: { type: String, required: true, unique: true }, // Unique ID for tool
    licenseVersion: { type: String, required: true },
    licenseExpiry: { type: Date, required: true },
    licenseType: { type: String, required: true },
    description: { type: String, default: '' },
    lastUpdateDate: { type: Date, required: true, default: Date.now },
    version: { type: String, required: true },
    notes: { type: String, default: '' },
    // testerId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: false,
    // },
  },
  { timestamps: true },
);

// Define and export the model
const ToolModel = model<ToolInterface>('Tool', toolSchema);

export default ToolModel;
export type { ToolInterface };

