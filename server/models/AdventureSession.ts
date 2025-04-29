import { Schema, model, Types, Document } from "mongoose";

export interface IEntry {
  prompt: string;
  response: string;
  timestamp: Date;
}

export interface IAdventureSession extends Document {
  userId: Types.ObjectId;
  title: string;
  category: string;
  entries: IEntry[];
  length: number;
  createdAt: Date;
  isActive: boolean;
}

const entrySchema = new Schema<IEntry>({
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const adventureSchema = new Schema<IAdventureSession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  entries: { type: [entrySchema], default: [] },
  length: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

export default model<IAdventureSession>("AdventureSession", adventureSchema);
