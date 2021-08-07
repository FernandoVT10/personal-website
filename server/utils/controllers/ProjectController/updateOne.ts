import { UserInputError, AuthenticationError } from "apollo-server-express";
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

  const newImagesURL = await ImageController.uploadFileUploadArrayAsImages(imagesToUpload);
  imagesURL.push(...newImagesURL);

  try {
    const technologiesDocuments = await Technology.find({ name: { $in: technologies } });

    Object.assign(project, {
      title,
      description,
      content,
      technologies: technologiesDocuments,
      images: imagesURL
    });

    await project.save();

    if(imagesToDelete?.length) {
      // if everything is ok, we need to delete the images from the server
      ImageController.deleteImageArray(imagesToDelete);
    }

    return project;
  } catch(err) {
    // delete the new images if there is an error
    ImageController.deleteImageArray(newImagesURL);
    throw err;
  }
}
