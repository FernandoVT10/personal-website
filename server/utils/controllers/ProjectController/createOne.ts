import { Error as MongooseError } from "mongoose";

import { AuthenticationError, ApolloError, UserInputError } from "apollo-server-express";
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

  try {
    const technologiesDocuments = await Technology.find({ name: { $in: technologies } });

    const project = new Project({
      title,
      description,
      content,
      technologies: technologiesDocuments,
      images: []
    }); 

    await project.validate();

    const imagesURL = await ImageController.uploadImages(filesUpload, "/projects/");

    project.images = imagesURL;

    return await project.save();
  } catch (err) {
    if(err instanceof MongooseError.ValidationError) {
      throw err;
    }

    console.log(err);
    throw new ApolloError("An error has appeared creating the project");
  }
}
