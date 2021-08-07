import { AuthenticationError, UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";

import ImageController from "../ImageController";

import { Project, IProject, Technology } from "../../../models";

interface Parameters {
  project: {
    title: string
    description: string
    technologies: string[]
    content: string
    images: { promise: Promise<FileUpload> }[]
  }
}

export default async (_: null, args: Parameters, context: { loggedIn: boolean }): Promise<IProject> => {
  if(!context.loggedIn) throw new AuthenticationError("You don't have enough permissions");

  const { title, description, content, technologies, images } = args.project;

  if(!images.length) {
    throw new UserInputError("You need at least add one image");
  }

  const filesUpload = [];

  for(const file of images) {
    filesUpload.push(await file.promise);
  }

  const imagesURL = await ImageController.uploadFileUploadArrayAsImages(filesUpload);

  try {
    const technologiesDocuments = await Technology.find({ name: { $in: technologies } });

    return await Project.create({
      title,
      description,
      content,
      technologies: technologiesDocuments,
      images: imagesURL
    });   
  } catch(err) {
    // delete the images if there is an error
    ImageController.deleteImageArray(imagesURL);
    throw err;
  }
}
