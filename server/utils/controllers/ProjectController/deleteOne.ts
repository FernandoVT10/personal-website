import { UserInputError, AuthenticationError } from "apollo-server-express";

import { Project, IProject } from "../../../models";

import { deleteImages } from "../ImageController";

interface Parameters {
  projectId: string
}

export default async (_: null, args: Parameters, context: { loggedIn: boolean }): Promise<IProject> => {
  if(!context.loggedIn) throw new AuthenticationError("You don't have enough permissions");

  const { projectId } = args;
  const project = await Project.findById(projectId).populate("technologies");

  if(!project) {
    throw new UserInputError(`The project with the ID '${projectId}' doesn't exist.`);
  }

  const imagesURLs: string[] =  [];
  project.images.forEach(image => 
    image.imageSpecs.forEach(
      imageSpec => imagesURLs.push(imageSpec.url)
    )
  );

  await deleteImages(imagesURLs);

  return await project.delete();
}
