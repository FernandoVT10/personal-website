import fs from "fs";
import path from "path";

import { IMAGE_DIRECTORY, getBasePath } from "./";

export default async (imageURL: string): Promise<void> => {
  try {
    // here i wanna get the path where the image is saved on the computer
    // and then concatenate it with the IMAGE_DIRECTORY variable
    // to replace the website url with the real image path
    const imagePath = getBasePath(imageURL);
    const imageFullPath = path.join(IMAGE_DIRECTORY, imagePath);
    await fs.promises.unlink(imageFullPath);
  } catch(err) {
    if(err.code !== "ENOENT") throw err;
  }
}
