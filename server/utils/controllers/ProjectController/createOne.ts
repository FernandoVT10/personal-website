import { Error as MongooseError } from "mongoose";

import { AuthenticationError, ApolloError, UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";

import { uploadImagesWithDifferentDimensions } from "../ImageController";

import { Project, IProject, Technology } from "../../../models";

import { PROJECT_IMAGES_SIZES } from "./";

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

  try {
    const filesUpload = [];
    for(const file of images) {
      filesUpload.push(await file.promise);
    }
    
    const technologiesDocuments = await Technology.find({ name: { $in: technologies } });

    const project = new Project({
      title,
      description,
      content,
      technologies: technologiesDocuments,
      images: []
    }); 

    await project.validate();

    const imagesSpecs = await uploadImagesWithDifferentDimensions(
      filesUpload, "/projects/", PROJECT_IMAGES_SIZES
    );

    imagesSpecs.forEach(imageSpecs => {
      project.images.push({ imageSpecs });
    });

    return await project.save();
  } catch (err) {
    if(err instanceof MongooseError.ValidationError) {
      throw err;
    }

    console.log(err);
    throw new ApolloError("An error has appeared creating the project");
  }
}
