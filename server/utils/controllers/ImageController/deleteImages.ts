import { ApolloError } from "apollo-server-express";

import deleteImage from "./deleteImage";

export default async (imagesURL: string[]): Promise<void> => {
  if(!imagesURL.length) return;

  try {
    for(const imageURL of imagesURL) {
      await deleteImage(imageURL);
    }
  } catch (err) {
    throw new ApolloError("Error trying to delete the images");
  }
}
