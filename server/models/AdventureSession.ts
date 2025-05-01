import { Schema, model, Types, Document } from "mongoose";

export interface IEntry {
  prompt: string;
  response: string;
  chaosScore?: number;
  timestamp: Date;
}

export interface IAdventureSession extends Document {
  userId: Types.ObjectId;
  title: string;
  category: string;
  isActive: boolean;
  entries: IEntry[];
}

const entrySchema = new Schema<IEntry>({
  prompt: String,
  response: String,
  chaosScore: Number,
  timestamp: { type: Date, default: Date.now },
});

const adventureSchema = new Schema<IAdventureSession>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  title: String,
  category: String,
  isActive: { type: Boolean, default: true },
  entries: [entrySchema],
});

export default model<IAdventureSession>("AdventureSession", adventureSchema);
