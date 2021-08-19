import { gql, AuthenticationError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";

import ImageController from "../utils/controllers/ImageController";

export const UploadImageSchema = gql`
  extend type Mutation {
    uploadImage(image: Upload!): String
  }
`;

interface Parameters {
  image: { promise: Promise<FileUpload> }
}

const uploadImage = async (_: null, args: Parameters, context: { loggedIn: boolean }) => {
  if(!context.loggedIn) throw new AuthenticationError("You don't have enough permissions");

  const image = await args.image.promise;

  return await ImageController.uploadImage(image);
}

export const UploadImageResolvers = {
  Mutation: {
    uploadImage
  }
}
