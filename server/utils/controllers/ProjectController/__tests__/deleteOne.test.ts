import { UserInputError, AuthenticationError } from "apollo-server-errors";

import { mocked } from "ts-jest/utils";

import { Project } from "../../../../models";

import { deleteImages } from "../../ImageController";

import deleteOne from "../deleteOne";

jest.mock("../../ImageController");

const PROJECT_MOCK = {
  title: "test title",
  description: "test description",
  content: "test content",
  technologies: [],
  images: [{
    imageSpecs: [
      { width: 100, height: 100, url: "https://test/test-100.webp" },
      { width: 500, height: 500, url: "https://test/test-500.webp" },
      { width: 1000, height: 1000, url: "https://test/test-1000.webp" }
    ]
  }]
}

setupTestDB("test_utils_controllers_project_deleteOne");

describe("server/utils/controllers/ProjectController/deleteOne", () => {
  const deleteImagesMocked = mocked(deleteImages);

  let projectId: string;

  beforeEach(async () => {
    jest.resetAllMocks();

    const project = await Project.create(PROJECT_MOCK);
    projectId = project._id;
  });

  it("should delete a project with its images", async () => {
    await deleteOne(null, { projectId }, { loggedIn: true });

    expect(await Project.exists({ _id: projectId })).toBeFalsy();

    expect(deleteImagesMocked).toHaveBeenCalledWith(
      [
        "https://test/test-100.webp",
        "https://test/test-500.webp",
        "https://test/test-1000.webp"
      ]
    );
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
