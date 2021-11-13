import { gql, AuthenticationError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";

import { uploadImage } from "../utils/controllers/ImageController";

export const UploadImageSchema = gql`
  extend type Mutation {
    uploadImage(image: Upload!): String
  }
`;

interface Parameters {
  image: { promise: Promise<FileUpload> }
}

const uploadImageResolver = async (_: null, args: Parameters, context: { loggedIn: boolean }) => {
  if(!context.loggedIn) throw new AuthenticationError("You don't have enough permissions");

  const image = await args.image.promise;

  return await uploadImage(image, "/content/");
}

export const UploadImageResolvers = {
  Mutation: {
    uploadImage: uploadImageResolver
  }
}
