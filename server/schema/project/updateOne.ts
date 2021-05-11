import { UserInputError } from "apollo-server-express";
import { FileUpload } from "graphql-upload";

import ImageController from "../../utils/controllers/ImageController";

import { Project, Technology } from "../../models";

interface Parameters {
  projectId: string
  project: {
    title: string
    description: string
    technologies: string[]
    currentImages: string[]
    newImages: { promise: Promise<FileUpload> }[]
  }
}

export default async (_: null, args: Parameters) => {
  const { projectId } = args;
  const { title, description, technologies, currentImages, newImages } = args.project;

  const project = await Project.findById(projectId);

  if(!project) {
    throw new UserInputError(`The project with the ID '${projectId}' doesn't exist.`);
  }

  const filesToUpload = [];

  if(newImages) {
    for(const file of newImages) {
      filesToUpload.push(await file.promise);
    }
  }

  const imagesToDelete = [];
  const imagesURL = [];

  // if the currentImages is undefined, we need to delete all the images of the project
  if(currentImages) {
    project.images.forEach(image => {
      if(currentImages.includes(image)) { return imagesURL.push(image) }

      imagesToDelete.push(image)
    });
  } else {
    imagesToDelete.push(...project.images);
  }

  const newImagesURL = await ImageController.uploadFileUploadArrayAsImages(filesToUpload);

  imagesURL.push(...newImagesURL);

  try {
    const technologiesDocuments = await Technology.find({ name: { $in: technologies } });

    Object.assign(project, {
      title,
      description,
      technologies: technologiesDocuments,
      images: imagesURL
    });

    await project.save();

    // if everything it's ok, we need to delete the old images from the server
    ImageController.deleteImageArray(imagesToDelete);

    return project;
  } catch(err) {
    // delete the images if there is an error
    ImageController.deleteImageArray(newImagesURL);
    throw err;
  }
}
