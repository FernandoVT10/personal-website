import { AuthenticationError, UserInputError } from "apollo-server-express";

import { mocked } from "ts-jest/utils";

import { Project, Technology } from "../../../../models";

import ImageController from "../../ImageController";

import createOne from "../createOne";

jest.mock("../../ImageController");

setupTestDB("test_utils_controllers_project_createOne");

const MOCK_TECHNOLOGIES = [
  { name: "technology 1" },
  { name: "technology 2" },
  { name: "technology 3" }
];

const FILE_UPLOAD_MOCK = {
  filename: "test.jpg"
} as any;

const PROJECT_MOCK = {
  title: "test title",
  description: "test description",
  content: "test content",
  technologies: ["technology 1", "technology 2", "technology 123"],
  images: [
    {
      promise: Promise.resolve(FILE_UPLOAD_MOCK)
    }
  ]
}

const mockedUploadFileUploadArrayAsImages = mocked(ImageController.uploadFileUploadArrayAsImages);
const mockedDeleteImageArray = mocked(ImageController.deleteImageArray);

describe("server/utils/controllers/ProjectController/createOne", () => {
  beforeEach(async () => {
    await Technology.insertMany(MOCK_TECHNOLOGIES);

    jest.resetAllMocks();

    mockedUploadFileUploadArrayAsImages.mockResolvedValue(["test-1.jpg", "test-2.jpg"]);
  });

  it("should create a project", async () => {
    const project = await createOne(null, { project: PROJECT_MOCK }, {  loggedIn: true });

    expect(await Project.exists({ _id: project._id })).toBeTruthy();

    expect(project.title).toBe("test title");
    expect(project.description).toBe("test description");
    expect(project.content).toBe("test content");

    expect(project.technologies).toHaveLength(2);
    expect(project.technologies[0].name).toBe("technology 1");
    expect(project.technologies[1].name).toBe("technology 2");

    expect([...project.images]).toEqual(["test-1.jpg", "test-2.jpg"]);

    expect(mockedUploadFileUploadArrayAsImages).toHaveBeenCalledWith([FILE_UPLOAD_MOCK]);
  });

  it("should throw an error when the user isn't logged in", async () => {
    try {
      await createOne(null, { project: null }, { loggedIn: false }); 
    } catch (err) {
      expect(err).toEqual(new AuthenticationError("You don't have enough permissions"));
    }
  });

  it("should throw an error when we don't add images", async () => {
    try {
      await createOne(null, {
        project: {
          ...PROJECT_MOCK,
          images: []
        }
      }, { loggedIn: true }); 
    } catch (err) {
      expect(err).toEqual(new UserInputError("You need at least add one image"));
    }
  });

  it("should delete all the images when it throws an error", async () => {
    try {
      await createOne(null, {
        project: {
          ...PROJECT_MOCK,
          title: ""
        }
      }, { loggedIn: true });
    } catch {
      expect(mockedDeleteImageArray).toHaveBeenCalledWith(["test-1.jpg", "test-2.jpg"]);
    }
  });
});
