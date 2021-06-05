import { UserInputError } from "apollo-server-express";

import { Project, IProject } from "../../models";

import ImageController from "../../utils/controllers/ImageController";

interface Parameters {
  projectId: string
}

export default async (_: null, args: Parameters): Promise<IProject> => {
  const { projectId } = args;

  const project = await Project.findById(projectId).populate("technologies");

  if(!project) {
    throw new UserInputError(`The project with the ID '${projectId}' doesn't exist.`);
  }

  ImageController.deleteImageArray(project.images);

  return await project.delete();
}
