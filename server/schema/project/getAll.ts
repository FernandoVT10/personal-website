import { PaginateResult } from "mongoose";

import { Project, IProject, Technology } from "../../models";

const PROJECTS_PER_PAGE = 6;

interface Parameters {
  search: string
  technology: string
  page: number
  limit: number
}

export default async (_: null, args: Parameters): Promise<PaginateResult<IProject>> => {
  const page = args.page ?? 1;
  const limit = args.limit ?? PROJECTS_PER_PAGE;

  const { search, technology } = args;

  const query = {}

  if(search) {
    const regex = new RegExp(`${search}.*`, "i");

    Object.assign(query, {
      title: regex
    });
  }

  if(technology) {
    const technologyDocument = await Technology.findOne({ name: technology });

    Object.assign(query, {
      technologies: technologyDocument
    });
  }

  return await Project.paginate(query, {
    page,
    limit,
    populate: "technologies",
    sort: { createdAt: "desc" }
  });
}
