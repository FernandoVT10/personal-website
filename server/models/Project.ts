import { Schema, model, Document, PaginateModel } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";

import { ITechnology } from "./Technology";

export interface IProject extends Document {
  Title: String,
  images: string[],
  description: string,
  technologies: ITechnology["_id"][]
}

const projectSchema = new Schema({
  title: {
    type: String,
    maxLength: [100, "The title must be less than 100 charactes"],
    required: [true, "The title is required"]
  },
  images: [String],
  description: {
    type: String,
    required: [true, "The description is required"]
  },
  technologies: [{
    type: Schema.Types.ObjectId,
    ref: "technology"
  }]
}, { timestamps: true });

projectSchema.plugin(mongoosePaginate);

export default model<IProject, PaginateModel<IProject>>("project", projectSchema, "projects");
