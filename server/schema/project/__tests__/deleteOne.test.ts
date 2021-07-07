import { UserInputError } from "apollo-server-errors";

import { mocked } from "ts-jest/utils";

import { Project } from "../../../models";

import ImageController from "../../../utils/controllers/ImageController";

import deleteOne from "../deleteOne";

jest.mock("../../../utils/controllers/ImageController");

const PROJECT_MOCK = {
  title: "test title",
  description: "test description",
  content: "test content",
  technologies: [],
  images: ["test-1.jpg", "test-2.jpg"]
}

setupTestDB("test_schema_project_createOne");

const mockedDeleteImageArray = mocked(ImageController.deleteImageArray);

describe("server/schema/project/deleteOne", () => {
  let projectId: string;

  beforeEach(async () => {
    const project = await Project.create(PROJECT_MOCK);

    projectId = project._id;
  });

  it("should delete a project correctly", async () => {
    const project = await deleteOne(null, { projectId });

    expect(await Project.exists({ _id: projectId })).toBeFalsy();

    expect(project.title).toBe("test title");

    const deletedImageArray = mockedDeleteImageArray.mock.calls[0][0];
    expect([...deletedImageArray]).toEqual(["test-1.jpg", "test-2.jpg"]);
  });

  it("should throw an error when the projectId doesn't exist", async () => {
    try {
      await deleteOne(null, { projectId: "abcdefabcdefabcdefabcdef" });
    } catch (err) {
      expect(err).toEqual(new UserInputError("The project with the ID 'abcdefabcdefabcdefabcdef' doesn't exist."));
    }
  });
});
