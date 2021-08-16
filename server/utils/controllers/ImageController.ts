import fs from "fs";

import { UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";
import { join } from "path";

import { PUBLIC_DIRECTORY, WEBSITE_URL } from "../../config";

import saveFileStream from "../saveFileStream";

import { imageValidator } from "../validators";

const IMAGES_PATH = join(PUBLIC_DIRECTORY, "/img/uploads");

const uploadFileUploadAsImage = async (file: FileUpload, directory = "/"): Promise<string> => {
  const imageName = Date.now() + file.filename;
  const dirPath = join(IMAGES_PATH, directory);
  const stream = file.createReadStream();

  if(!imageValidator(file.mimetype)) throw new UserInputError("The file must be a .png, .jpg or .jpeg image");

  try {
    // if the directory doesn't exist we need to create it
    if(!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const imagePath = join(dirPath, imageName);

    await saveFileStream(stream, imagePath);

    const imageURL = join(WEBSITE_URL, "/img/uploads/", directory, imageName).replace(":/", "://");
    return imageURL;
  } catch (err) {
    throw err;
  }
}

const uploadFileUploadArrayAsImages = (filesUpload: FileUpload[]): Promise<string[]> => {
  filesUpload.forEach(filesUpload => {
    if(!imageValidator(filesUpload.mimetype)) {
      throw new UserInputError("All the files must be a .png, .jpg or .jpeg image");
    }
  });
  
  return Promise.all(filesUpload.map(fileUpload => {
    return uploadFileUploadAsImage(fileUpload);
  }));
}

const deleteImage = (fileURL: string) => {
  const imagePath = fileURL.replace(WEBSITE_URL, "");
  const imageCompletePath = join(PUBLIC_DIRECTORY, imagePath);

  if(fs.existsSync(imageCompletePath)) fs.unlinkSync(imageCompletePath);
}

const deleteImageArray = (filesURL: string[]) => {
  filesURL.forEach(fileURL => deleteImage(fileURL));
}

export default {
  uploadFileUploadAsImage,
  uploadFileUploadArrayAsImages,
  deleteImage,
  deleteImageArray
}
