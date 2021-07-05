import { UserInputError } from "apollo-server-errors";
import { Project, IProject } from "../../models";

const PROJECTS_LIMIT = 6;

interface Parameters {
  projectId: string,
  limit: number
}

export default async (_: null, args: Parameters): Promise<IProject[]> => {
  const { projectId } = args;
  const limit = args.limit ?? PROJECTS_LIMIT;

  const project = await Project.findById(projectId);

  if(!project) throw new UserInputError(`The project "${projectId}" doesn't exist`);

  const relatedProjects = await Project.find({
    technologies: { $in: project.technologies },
    _id: { $not: { $eq: projectId } }
  })
  .sort({ createdAt: "desc" }).populate("technologies").limit(limit);

  return relatedProjects;
}
