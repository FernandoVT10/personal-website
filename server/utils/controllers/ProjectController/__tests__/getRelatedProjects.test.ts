import { UserInputError } from "apollo-server-errors";

import { Project, IProject, Technology } from "../../../../models";

import getRelatedProjects from "../getRelatedProjects";

setupTestDB("test_utils_controllers_project_getRelatedProjects");

const TECHNOLOGIES_MOCK = [
  { name: "technology 1" },
  { name: "technology 2" },
  { name: "technology 3" }
];

const PROJECTS_MOCK = [
  {
    title: "project 1",
    images: ["project-1-1.jpg", "project-1-2.jpg"],
    description: "project 1 description",
    content: "test content",
    technologies: [],
    createdAt: Date.now() - 2
  },
  {
    title: "project 2",
    images: ["project-2-1.jpg", "project-2-2.jpg"],
    description: "project 2 description",
    content: "test content",
    technologies: [],
    createdAt: Date.now() - 1
  },
  {
    title: "project 3",
    images: ["project-3-1.jpg", "project-3-2.jpg"],
    description: "project 3 description",
    content: "test content",
    technologies: [],
    createdAt: Date.now()
  }
];

describe("server/utils/controllers/ProjectController/getRelatedProjects", () => {
  let projects: IProject[] = [];

  beforeEach(async () => {
    const technologies = await Technology.create(TECHNOLOGIES_MOCK);

    PROJECTS_MOCK[0].technologies = [technologies[0], technologies[1]];
    PROJECTS_MOCK[1].technologies = [technologies[1], technologies[2]];
    PROJECTS_MOCK[2].technologies = [technologies[2], technologies[0]];

    projects = await Project.create(PROJECTS_MOCK);
  });

  it("should get the related projects correctly", async () => {
    const projectId = projects[1]._id;

    const relatedProjects = await getRelatedProjects(null, { projectId, limit: 6 });

    expect(relatedProjects).toHaveLength(2);

    expect(relatedProjects[0].title).toBe("project 3");
    expect(relatedProjects[0].description).toBe("project 3 description");
    expect(relatedProjects[0].technologies[0].name).toBe("technology 3");
    expect(relatedProjects[0].technologies[1].name).toBe("technology 1");

    expect(relatedProjects[1].title).toBe("project 1");
    expect(relatedProjects[1].description).toBe("project 1 description");
    expect(relatedProjects[1].technologies[0].name).toBe("technology 1");
    expect(relatedProjects[1].technologies[1].name).toBe("technology 2");
  });

  it("should throw an error when the projectId doesn't exist", async () => {
    try {
      await getRelatedProjects(null, { projectId: "abcedfabcedfabcedfabcedf", limit: 6 });
    } catch (err) {
      expect(err).toEqual(new UserInputError(`The project "abcedfabcedfabcedfabcedf" doesn't exist`));
    }
  });
});
