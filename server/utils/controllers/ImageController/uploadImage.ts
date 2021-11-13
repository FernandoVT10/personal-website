import path from "path";

import fs from "fs";
import sharp from "sharp";

import { UserInputError, ApolloError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";

import saveFileStream from "../../saveFileStream";

import { imageValidator } from "../../validators";

import { getWebsiteURL, generateRandomName, IMAGE_DIRECTORY } from "./";

export default async (image: FileUpload, folder = ""): Promise<string> => {
  const { mimetype, filename, createReadStream } = image;

  if(!imageValidator(mimetype)) throw new UserInputError("The file must be an image");

  try {
    // create the directory if it doesn't exist
    const imageDir = path.join(IMAGE_DIRECTORY, folder);
    await fs.promises.mkdir(imageDir, { recursive: true });

    // save the image
    const imageName = `${generateRandomName()}.webp`;
    const imageStream = createReadStream();
    const imagePath = path.join(imageDir, imageName);

    // convert the image to webp
    const sharpPipeline = sharp().webp();
    imageStream.pipe(sharpPipeline);

    await saveFileStream(sharpPipeline, imagePath);

    const imageURL = getWebsiteURL(imagePath);
    return imageURL;
  } catch(err) {
    console.error(err);
    throw new ApolloError(`Error trying to upload the ${filename} image to the server.`);
  }
}
