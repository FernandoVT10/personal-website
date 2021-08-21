import { join } from "path";
import { UserInputError, ApolloError } from "apollo-server-express";

import ibm from "ibm-cos-sdk";

import { FileUpload } from "graphql-upload";

import { imageValidator } from "../validators";

import { IBM_CONFIG, WEBSITE_URL  } from "../../config";

const cos = new ibm.S3({
  endpoint: IBM_CONFIG.endpoint,
  apiKeyId: IBM_CONFIG.apiKeyId,
  serviceInstanceId: IBM_CONFIG.serviceInstanceid
});

const getImage = async (imageKey: string) => {
  const image = await cos.getObject({
    Bucket: IBM_CONFIG.bucket,
    Key: imageKey
  }).promise();

  return image;
}

const uploadImage = async (image: FileUpload): Promise<string> => {
  const { mimetype, filename, createReadStream } = image;

  if(!imageValidator(image.mimetype)) throw new UserInputError("The file must be a .png, .jpg or .jpeg image");

  try {
    const Key = `${Date.now()}-${filename}`;

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const stream = createReadStream();

      const buffers = [];

      stream.on("data", buffer => buffers.push(buffer));
      stream.on("end", () => resolve(Buffer.concat(buffers)));
      stream.on("error", err => reject(err));
    });

    await cos.putObject({
      Bucket: IBM_CONFIG.bucket,
      Key,
      Body: buffer,
      ContentType: mimetype
    }).promise();

    const imageURL = join(WEBSITE_URL, "/img/uploads/", Key).replace(":/", "://");
    return imageURL;
  } catch(err) {
    console.log(err);
    throw new ApolloError(`Error trying to upload the ${filename} image to the server.`);
  }
}

const uploadImages = async (images: FileUpload[]): Promise<string[]> => {
  if(!images.length) return [];

  images.forEach(filesUpload => {
    if(!imageValidator(filesUpload.mimetype)) {
      throw new UserInputError("All the files must be a .png, .jpg or .jpeg image");
    }
  });

  return Promise.all(images.map(image => uploadImage(image)));
}

const deleteImages = async (imagesURL: string[]): Promise<void> => {
  if(!imagesURL.length) return;

  try {
    const Objects = imagesURL.map(imageURL => ({
      Key: imageURL.split(`/img/uploads/`)[1]
    }));

    await cos.deleteObjects({
      Bucket: IBM_CONFIG.bucket,
      Delete: { Objects }
    }).promise();
  } catch (err) {
    throw new ApolloError("Error trying to delete the images");
  }
}

export default {
  getImage,
  uploadImage,
  uploadImages,
  deleteImages
}
