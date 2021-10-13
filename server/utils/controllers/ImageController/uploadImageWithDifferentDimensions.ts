import path from "path";

import fs, { ReadStream } from "fs";
import sharp, { Sharp } from "sharp";

import { UserInputError, ApolloError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";

import saveFileStream from "../../saveFileStream";

import { imageValidator } from "../../validators";

import { getWebsiteURL, generateRandomName, IMAGE_DIRECTORY } from "./";

export type IImageSpec = {
  width: number
  height: number
  url: string
}

export type ISize = {
  width: number
  height: number
}

export const getOriginalSizeFromSharp = (sharp: Sharp): Promise<ISize> => {
  return new Promise<ISize>((resolve, reject) => {
    sharp.metadata((err, metadata) => {
      if(err) return reject(err);
      const { width, height } = metadata;
      resolve({ width, height });
    });
  });
}

export const createBufferFromStream = (stream: ReadStream): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const buffer = [];

    stream.on("data", data => buffer.push(data));
    stream.on("end", () => resolve(Buffer.concat(buffer)));
    stream.on("error", reject);
  });
}

export default async (image: FileUpload, folder: string, sizes: ISize[]): Promise<IImageSpec[]> => {
  const { mimetype, createReadStream } = image;

  if(!imageValidator(mimetype)) throw new UserInputError("The file must be an image");

  try {
    // create the directory if it doesn't exist
    const imageDir = path.join(IMAGE_DIRECTORY, folder);
    await fs.promises.mkdir(imageDir, { recursive: true });

    const imageName = generateRandomName();
    const imageSpecs: IImageSpec[] = [];

    const imageBuffer = await createBufferFromStream(
      createReadStream()
    );

    for(const { width, height } of sizes) {
      const name = `${imageName}-${width}.webp`;
      const imagePath = path.join(imageDir, name);

      const sharpPipeline = sharp(imageBuffer).resize(width, height).webp();

      await saveFileStream(sharpPipeline, imagePath);

      const url = getWebsiteURL(imagePath);

      imageSpecs.push({ width, height, url });
    }

    const name = `${imageName}.webp`;
    const imagePath = path.join(imageDir, name);

    const sharpPipeline = sharp(imageBuffer).webp();

    await saveFileStream(sharpPipeline, imagePath);

    const originalSize = await getOriginalSizeFromSharp(sharpPipeline);

    const url = getWebsiteURL(imagePath);

    imageSpecs.push({ ...originalSize, url });

    return imageSpecs;
  } catch(err) {
    console.log(err);
    throw new ApolloError(`Error trying to upload the ${image.filename} image to the server.`);
  }
}
