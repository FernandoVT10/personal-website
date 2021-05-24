import { Project } from "../../models";

const PROJECTS_PER_PAGE = 6;

interface Parameters {
  search: string
  page: number
  limit: number
}

export default async (_: null, args: Parameters) => {
  const page = args.page || 1;
  const limit = args.limit || PROJECTS_PER_PAGE;

  const { search } = args;

  const query = {}

  if(search) {
    const regex = new RegExp(`${search}.*`, "i");

    Object.assign(query, {
      title: regex
    });
  }

  return await Project.paginate(query, {
    page,
    limit,
    populate: "technologies",
    sort: { createdAt: "desc" }
  });
}
