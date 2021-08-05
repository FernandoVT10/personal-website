import { UserInputError } from "apollo-server-express";

import { Project, IProject } from "../../../models";

interface Parameters {
  projectId: string
}

export default async (_: null, args: Parameters): Promise<IProject> => {
  const { projectId } = args;

  const project = await Project.findById(projectId).populate("technologies");

  if(!project) throw new UserInputError(`The project "${projectId}" doesn't exist`);

  return project;
}
