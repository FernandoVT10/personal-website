import { UserInputError, AuthenticationError } from "apollo-server-errors";

import { mocked } from "ts-jest/utils";

import { Project } from "../../../../models";

import ImageController from "../../ImageController";

import deleteOne from "../deleteOne";

jest.mock("../../ImageController");

const PROJECT_MOCK = {
  title: "test title",
  description: "test description",
  content: "test content",
  technologies: [],
  images: ["test-1.jpg", "test-2.jpg"]
}

setupTestDB("test_utils_controller_project_deleteOne");

const deleteImagesMocked = mocked(ImageController.deleteImages);

describe("server/utils/controllers/ProjectController/deleteOne", () => {
  let projectId: string;

  beforeEach(async () => {
    const project = await Project.create(PROJECT_MOCK);

    projectId = project._id;
  });

  it("should delete a project correctly", async () => {
    const project = await deleteOne(null, { projectId }, { loggedIn: true });

    expect(await Project.exists({ _id: projectId })).toBeFalsy();

    expect(project.title).toBe("test title");

    const deletedImageArray = deleteImagesMocked.mock.calls[0][0];
    expect([...deletedImageArray]).toEqual(["test-1.jpg", "test-2.jpg"]);
  });

  it("should throw an error when the user isn't logged in", async () => {
    try {
      await deleteOne(null, { projectId: null }, { loggedIn: false });
    } catch (err) {
      expect(err).toEqual(new AuthenticationError("You don't have enough permissions"));
    }
  });

  it("should throw an error when the projectId doesn't exist", async () => {
    try {
      await deleteOne(null, { projectId: "abcdefabcdefabcdefabcdef" }, { loggedIn: true });
    } catch (err) {
      expect(err).toEqual(new UserInputError("The project with the ID 'abcdefabcdefabcdefabcdef' doesn't exist."));
    }
  });
});
