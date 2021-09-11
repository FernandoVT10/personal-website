import { Error as MongooseError } from "mongoose";

import { UserInputError, ApolloError, AuthenticationError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";

import ImageController from "../ImageController";

import { Project, IProject, Technology } from "../../../models";

interface Parameters {
  projectId: string
  project: {
    title: string
    imagesToDelete: string[]
    newImages?: { promise: Promise<FileUpload> }[]
    description: string
    content: string
    technologies: string[]
  }
}

export default async (_: null, args: Parameters, context: { loggedIn: boolean }): Promise<IProject> => {
  if(!context.loggedIn) throw new AuthenticationError("You don't have enough permissions");

  const { projectId } = args;
  const { title, description, content, technologies, newImages } = args.project;

  let { imagesToDelete } = args.project;

  const project = await Project.findById(projectId);

  if(!project) {
    throw new UserInputError(`The project with the ID '${projectId}' doesn't exist.`);
  }

  const imagesURL = [];

  if(imagesToDelete?.length) {
    // here we're filtering the images that don't exist in the project
    imagesToDelete = imagesToDelete.filter(imageToDelete => project.images.includes(imageToDelete));

    project.images.forEach(image => {
      // if the project image isn't on the imagesToDelete array, it means we can add the project image to the
      // imagesURL array
      if(!imagesToDelete.includes(image)) return imagesURL.push(image);
    });
  } else {
    // if the imagesToDelete is null we can add all the images of the project again
    imagesURL.push(...project.images);
  }

  const imagesToUpload = [];

  if(newImages) {
    for(const file of newImages) {
      imagesToUpload.push(await file.promise);
    }
  }

  try {
    const technologiesDocuments = await Technology.find({ name: { $in: technologies } });

    Object.assign(project, {
      title,
      description,
      content,
      technologies: technologiesDocuments,
      images: []
    });

    await project.validate();

    const newImagesURL = await ImageController.uploadImages(imagesToUpload, "/projects/");
    imagesURL.push(...newImagesURL);

    project.images = imagesURL;

    await project.save();

    if(imagesToDelete?.length) {
      // if everything is ok, we need to delete the images from the server
      await ImageController.deleteImages(imagesToDelete);
    }

    return project;
  } catch (err) {
    if(err instanceof MongooseError.ValidationError) {
      throw err;
    }

    console.log(err);
    throw new ApolloError("An error has appeared creating the project");
  }
}
