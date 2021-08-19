import { UserInputError, ApolloError } from "apollo-server-express";

import ibm from "ibm-cos-sdk";

import { FileUpload } from "graphql-upload";

import { imageValidator } from "../validators";

import { IBM_CONFIG } from "../../config";

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

    return Key;
  } catch(err) {
    console.log(err);
    throw new ApolloError(`Error trying to upload the ${filename} image to the server.`);
  }
}

const uploadImages = async (images: FileUpload[]): Promise<string[]> => {
  images.forEach(filesUpload => {
    if(!imageValidator(filesUpload.mimetype)) {
      throw new UserInputError("All the files must be a .png, .jpg or .jpeg image");
    }
  });

  return Promise.all(images.map(image => uploadImage(image)));
}

export default {
  // mocks
  uploadFileUploadArrayAsImages: (_: any[]): any => {},
  deleteImageArray: (_: string[]) => {},
  // end of mocks
  getImage,
  uploadImage,
  uploadImages
}
