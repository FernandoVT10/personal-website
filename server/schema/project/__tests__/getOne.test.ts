import { UserInputError } from "apollo-server-express";
import { Types } from "mongoose";

import { Project, Technology } from "../../../models";

import getOne from "../getOne";

setupTestDB("test_schema_project_getOne");

const TECHNOLOGIES_MOCK = [
  { name: "technology 1" },
  { name: "technology 2" },
  { name: "technology 3" }
];

const PROJECT_MOCK = {
  title: "project",
  images: ["project-1.jpg", "project-2.jpg"],
  description: "project description",
  content: "project content",
  technologies: [],
}

describe("server/schema/project/getOne", () => {
  let projectId = "";

  beforeEach(async () => {
    const technologies = await Technology.create(TECHNOLOGIES_MOCK);

    PROJECT_MOCK.technologies = technologies;

    const project = await Project.create(PROJECT_MOCK);
    projectId = project._id;
  });

  it("should return a project correctly", async () => {
    const project = await getOne(null, { projectId });

    expect(project.title).toBe(PROJECT_MOCK.title);
    project.images.forEach((image, index) => {
      expect(image).toBe(PROJECT_MOCK.images[index]);
    });
    expect(project.description).toBe(PROJECT_MOCK.description);
    expect(project.content).toBe(PROJECT_MOCK.content);

    project.technologies.forEach((techhnology, index) => {
      expect(techhnology.name).toBe(TECHNOLOGIES_MOCK[index].name);
    });
  });

  it("should throw an error when the projectId doesn't exist", async () => {
    const newProjectId = Types.ObjectId().toHexString();

    try {
      await getOne(null, { projectId: newProjectId });
    } catch (err) {
      expect(err).toEqual(new UserInputError(`The project "${newProjectId}" doesn't exist`));
    }
  });
});
