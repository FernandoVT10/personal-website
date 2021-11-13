import { Schema, Types, model, Document, PaginateModel } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";

import { ITechnology } from "./Technology";

interface IImageObject extends Types.Subdocument {
  imageSpecs: {
    width: number
    height: number
    url: string
  }[]
}

const imageObjectSchema = new Schema({
  imageSpecs: [new Schema({
    width: Number,
    height: Number,
    url: String
  }, { _id: false })]
});

export interface IProject extends Document {
  title: String,
  images: Types.Array<IImageObject>,
  description: string,
  content: string,
  technologies: ITechnology["_id"][]
}

const projectSchema = new Schema({
  title: {
    type: String,
    maxLength: [100, "The title must be less than 100 characters"],
    required: [true, "The title is required"]
  },
  images: [imageObjectSchema],
  description: {
    type: String,
    maxLength: [250, "The description must be less than 250 characters"],
    required: [true, "The description is required"]
  },
  content: {
    type: String,
    required: [true, "The content is required"]
  },
  technologies: [{
    type: Schema.Types.ObjectId,
    ref: "technology"
  }]
}, { timestamps: true });

projectSchema.plugin(mongoosePaginate);

export default model<IProject, PaginateModel<IProject>>("project", projectSchema, "projects");
