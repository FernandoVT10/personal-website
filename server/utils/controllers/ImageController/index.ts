import path from "path";

import { PUBLIC_DIRECTORY, WEBSITE_URL  } from "../../../config";

const UPLOADS_DIRECTORY = "/img/uploads";
export const IMAGE_DIRECTORY = path.join(PUBLIC_DIRECTORY, UPLOADS_DIRECTORY);

export const generateRandomName = (): string => {
  const randomNumber = Math.random().toString().substring(2, 8);
  return Date.now() + randomNumber;
}

export const getBasePath = (imagePath: string): string => imagePath.split(UPLOADS_DIRECTORY)[1];

export const getWebsiteURL = (imagePath: string): string => {
  const imageBasePath = getBasePath(imagePath);
  // then we need to create a url to use in our website
  // here i'm using the WEBSITE_URL variable that contains the url
  // for our website where the images will be storaged
  return path.join(WEBSITE_URL, UPLOADS_DIRECTORY, imageBasePath).replace(":/", "://");
}

export type { IImageSpec, ISize } from "./uploadImageWithDifferentDimensions";

export { default as uploadImage } from "./uploadImage";
export { default as uploadImageWithDifferentDimensions } from "./uploadImageWithDifferentDimensions";
export { default as uploadImagesWithDifferentDimensions } from "./uploadImagesWithDifferentDimensions";

export { default as deleteImage } from "./deleteImage";
export { default as deleteImages } from "./deleteImages";
