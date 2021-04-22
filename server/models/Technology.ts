import { Schema, model, Document } from "mongoose";

export interface ITechnology extends Document {
  name: string
}

const technologySchema = new Schema({
  name: {
    type: String,
    required: [true, "The name is required"]
  }
});

export default model<ITechnology>("technology", technologySchema, "technologies");
