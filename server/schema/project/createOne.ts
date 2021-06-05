import { FileUpload } from "graphql-upload";

import ImageController from "../../utils/controllers/ImageController";

import { Project, IProject, Technology } from "../../models";

interface Parameters {
  project: {
    title: string
    description: string
    technologies: string[]
    images: { promise: Promise<FileUpload> }[]
  }
}

export default async (_: null, args: Parameters): Promise<IProject> => {
  const { title, description, technologies, images } = args.project;

  const filesUpload = [];

  if(images) {
    for(const file of images) {
      filesUpload.push(await file.promise);
    }
  }

  const imagesURL = await ImageController.uploadFileUploadArrayAsImages(filesUpload);

  try {
    const technologiesDocuments = await Technology.find({ name: { $in: technologies } });

    return await Project.create({
      title,
      description,
      technologies: technologiesDocuments,
      images: imagesURL
    });   
  } catch(err) {
    // delete the images if there is an error
    ImageController.deleteImageArray(imagesURL);
    throw err;
  }
}
