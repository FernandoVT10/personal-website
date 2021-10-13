import { UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import {imageValidator} from "../../validators";

import uploadImageWithDifferentDimensions, { ISize, IImageSpec } from "./uploadImageWithDifferentDimensions";

export default async (images: FileUpload[], folder: string, sizes: ISize[]): Promise<IImageSpec[][]> => {
  if(!images.length) return [];

  images.forEach(image => {
    if(!imageValidator(image.mimetype)) throw new UserInputError(`The file ${image.filename} isn't an image`);
  });

  return Promise.all(
    images.map(image => uploadImageWithDifferentDimensions(image, folder, sizes))
  );
}
