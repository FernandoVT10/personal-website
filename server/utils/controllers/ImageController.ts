import fs from "fs";
import sharp from "sharp";

import { join } from "path";
import { UserInputError, ApolloError } from "apollo-server-express";

import { FileUpload } from "graphql-upload";

import { imageValidator } from "../validators";

import saveFileStream from "../saveFileStream";

import { PUBLIC_DIRECTORY, WEBSITE_URL  } from "../../config";

const IMAGE_DIRECTORY = join(PUBLIC_DIRECTORY, "/img/uploads/");

const generateRandomName = (): string => {
  const randomNumber = Math.random().toString().substring(2, 8);
  return Date.now() + randomNumber;
}

const uploadImage = async (image: FileUpload, folder = ""): Promise<string> => {
  const { mimetype, filename, createReadStream } = image;

  if(!imageValidator(mimetype)) throw new UserInputError("The file must be a .png, .jpg or .jpeg image");

  try {
    // create the directory if it doesn't exist
    const imageDir = join(IMAGE_DIRECTORY, folder);
    await fs.promises.mkdir(imageDir, { recursive: true });

    // save the image
    const imageName = `${generateRandomName()}.webp`;
    const imageStream = createReadStream();
    const imagePath = join(imageDir, imageName);

    // convert the image to webp
    const sharpPipeline = sharp().webp();
    imageStream.pipe(sharpPipeline);

    saveFileStream(sharpPipeline, imagePath);

    // then we need to create a url to use in our website
    // here i'm using the WEBSITE_URL variable that contains the url
    // for our website where the images will be storaged
    const imageURL = join(WEBSITE_URL, "/img/uploads/", folder, imageName).replace(":/", "://");
    return imageURL;
  } catch(err) {
    console.error(err);
    throw new ApolloError(`Error trying to upload the ${filename} image to the server.`);
  }
}

const uploadImages = async (images: FileUpload[], folder = ""): Promise<string[]> => {
  if(!images.length) return [];

  images.forEach(filesUpload => {
    if(!imageValidator(filesUpload.mimetype)) {
      throw new UserInputError("All the files must be a .png, .jpg or .jpeg image");
    }
  });

  return Promise.all(images.map(image => uploadImage(image, folder)));
}

const deleteImage = async (imageURL: string): Promise<void> => {
  try {
    // here i wanna get the path after of the "/img/uploads/"
    // and then concatenate it with the IMAGE_DIRECTORY variable
    // to replace the website url with the real image path
    const imagePath = imageURL.split("/img/uploads/")[1];
    const imageFullPath = join(IMAGE_DIRECTORY, imagePath);
    await fs.promises.unlink(imageFullPath);
  } catch(err) {
    if(err.code !== "ENOENT") throw err;
  }
}

const deleteImages = async (imagesURL: string[]): Promise<void> => {
  if(!imagesURL.length) return;

  try {
    for(const imageURL of imagesURL) {
      await deleteImage(imageURL);
    }
  } catch (err) {
    throw new ApolloError("Error trying to delete the images");
  }
}

export default {
  uploadImage,
  uploadImages,
  deleteImage,
  deleteImages
}
