import { FileUpload } from "graphql-upload";

import ImageController from "../../utils/controllers/ImageController";

import { Project, Technology } from "../../models";

interface Parameters {
  project: {
    title: string
    description: string
    technologies: string[]
    images: { promise: Promise<FileUpload> }[]
  }
}

export default async (_: null, args: Parameters) => {
  const { title, description, technologies, images } = args.project;

  const filesUpload = [];

  if(images) {
    for(const file of images) {
      filesUpload.push(await file.promise);
    }
  }

  const imagesURL = await ImageController.uploadFileUploadArrayAsImages(filesUpload);

  const technologiesDocuments = await Technology.find({ name: { $in: technologies } });

  return await Project.create({
    title,
    description,
    technologies: technologiesDocuments,
    images: imagesURL
  });
}
