import { Project, Technology } from "../../models";

interface Parameters {
  project: {
    title: string
    description: string
    technologies: string[]
    images: string[]
  }
}

export default async (_: null, args: Parameters) => {
  const { title, description, technologies, images } = args.project;

  console.log(images);
  
  const technologiesDocuments = await Technology.find({ name: { $in: technologies } });

  return await Project.create({ title, description, technologies: technologiesDocuments });
}
