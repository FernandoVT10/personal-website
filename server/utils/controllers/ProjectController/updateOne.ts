import { Error as MongooseError } from "mongoose";

import { UserInputError, ApolloError, AuthenticationError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";

import { deleteImages, uploadImagesWithDifferentDimensions } from "../ImageController";

import { Project, IProject, Technology } from "../../../models";

import { PROJECT_IMAGES_SIZES } from "./";

interface Parameters {
  projectId: string
  project: {
    title: string
    imagesIdsToDelete?: string[]
    newImages?: { promise: Promise<FileUpload> }[]
    description: string
    content: string
    technologies: string[]
  }
}

export default async (_: null, args: Parameters, context: { loggedIn: boolean }): Promise<IProject> => {
  if(!context.loggedIn) throw new AuthenticationError("You don't have enough permissions");

  const { projectId } = args;
  const {
    title, description, content, technologies, imagesIdsToDelete, newImages
  } = args.project;

  const project = await Project.findById(projectId);

  if(!project) {
    throw new UserInputError(`The project with the ID '${projectId}' doesn't exist.`);
  }

  const imagesURLsToDelete: string[] = [];

  if(imagesIdsToDelete?.length) {
    imagesIdsToDelete.forEach(imageId => {
      const imageToDelete = project.images.find(image => image._id.toString() === imageId);
      if(imageToDelete) {
        const imageURLs = imageToDelete.imageSpecs.map(imageSpec => imageSpec.url);
        imagesURLsToDelete.push(...imageURLs);
      }

      project.images.pull({ _id: imageId });
    });
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
      technologies: technologiesDocuments
    });

    await project.validate();

    const newImagesSpecs = await uploadImagesWithDifferentDimensions(
      imagesToUpload, "/projects/", PROJECT_IMAGES_SIZES
    );
    newImagesSpecs.forEach(imageSpecs => {
      project.images.push({ imageSpecs });
    });

    await project.save();

    // if everything goes ok we can delete the unused images
    await deleteImages(imagesURLsToDelete);

    return project;
  } catch (err) {
    if(err instanceof MongooseError.ValidationError) {
      throw err;
    }

    console.log(err);
    throw new ApolloError("An error has appeared creating the project");
  }
}
