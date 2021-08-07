import { AuthenticationError, UserInputError } from "apollo-server-errors";
import { mocked } from "ts-jest/utils";

import { Project, Technology } from "../../../../models";

import ImageController from "../../ImageController";

import updateOne from "../updateOne";

jest.mock("../../ImageController");

setupTestDB("test_utils_controllers_project_updateOne");

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
  technologies: [],
  images: ["test-1.jpg", "test-2.jpg", "test-3.jpg"]
}

const mockedUploadFileUploadArrayAsImages = mocked(ImageController.uploadFileUploadArrayAsImages);
const mockedDeleteImageArray = mocked(ImageController.deleteImageArray);

describe("server/utils/controllers/ProjectController/updateOne", () => {
  let projectId: string;

  beforeEach(async () => {
    const technologies = await Technology.create(MOCK_TECHNOLOGIES);

    PROJECT_MOCK.technologies = [technologies[0], technologies[1]];

    const project = await Project.create(PROJECT_MOCK);
    projectId = project._id;

    jest.resetAllMocks();

    mockedUploadFileUploadArrayAsImages.mockResolvedValue(["updated.jpg"]);
  });

  it("should update a project correctly", async () => {
    const updatedProject = await updateOne(null, {
      projectId,
      project: {
        title: "updated title",
        description: "updated description",
        content: "updated content",
        technologies: ["technology 1", "technology 3"],
        imagesToDelete: ["test-2.jpg", "test-3.jpg"],
        newImages: [
          { promise: Promise.resolve(FILE_UPLOAD_MOCK) }
        ]
      }
    }, { loggedIn: true });

    expect(updatedProject.title).toBe("updated title");
    expect(updatedProject.description).toBe("updated description");
    expect(updatedProject.content).toBe("updated content");

    expect(updatedProject.technologies[0].name).toBe("technology 1");
    expect(updatedProject.technologies[1].name).toBe("technology 3");

    expect([...updatedProject.images]).toEqual(["test-1.jpg", "updated.jpg"]);

    expect(mockedUploadFileUploadArrayAsImages).toHaveBeenCalledWith([FILE_UPLOAD_MOCK]);

    expect(mockedDeleteImageArray).toHaveBeenCalledWith(["test-2.jpg", "test-3.jpg"]);
  });

  it("should update a project correctly without newImages parameter", async () => {
    mockedUploadFileUploadArrayAsImages.mockResolvedValue([]);

    const updatedProject = await updateOne(null, {
      projectId,
      project: {
        title: "updated title",
        description: "updated description",
        content: "updated content",
        technologies: ["technology 1", "technology 3"],
        imagesToDelete: ["test-1.jpg"],
        newImages: []
      }
    }, { loggedIn: true });

    expect([...updatedProject.images]).toEqual(["test-2.jpg", "test-3.jpg"]);

    expect(mockedUploadFileUploadArrayAsImages).toHaveBeenCalledWith([]);

    expect(mockedDeleteImageArray).toHaveBeenCalledWith(["test-1.jpg"]);
  });

  it("should delete any image when the imagesToDelete is empty", async () => {
    mockedUploadFileUploadArrayAsImages.mockResolvedValue([]);

    const updatedProject = await updateOne(null, {
      projectId,
      project: {
        title: "updated title",
        description: "updated description",
        content: "updated content",
        technologies: ["technology 1", "technology 3"],
        imagesToDelete: [],
        newImages: []
      }
    }, { loggedIn: true });

    expect([...updatedProject.images]).toEqual(["test-1.jpg", "test-2.jpg", "test-3.jpg"]);

    expect(mockedDeleteImageArray).toHaveBeenCalledWith([]);
  });

  it("should throw an error when user isn't logged in", async () => {
    try {
      await updateOne(null, { projectId: null, project: {} as any }, { loggedIn: false });
    } catch(err) {
      expect(err).toEqual(new AuthenticationError("You don't have enough permissions"))
    }
  });

  it("should throw an error when the projectId doesn't exist", async () => {
    try {
      await updateOne(null, { projectId: "abcdefabcdefabcdefabcdef", project: {} as any }, { loggedIn: true });
    } catch(err) {
      expect(err).toEqual(new UserInputError("The project with the ID 'abcdefabcdefabcdefabcdef' doesn't exist."))
    }
  });

  it("should delete all the new images and shouldn't delete the images on the imagesToDelete array when it throws an error", async () => {
    try {
      await updateOne(null, {
        projectId,
        project: {
          title: "",
          description: "updated description",
          content: "updated content",
          technologies: ["technology 1", "technology 3"],
          imagesToDelete: ["test-1.jpg"],
          newImages: [
            { promise: Promise.resolve(FILE_UPLOAD_MOCK) }
          ]
        }
      }, { loggedIn: true });   
    } catch {
      // images on the newImages array
      expect(mockedUploadFileUploadArrayAsImages).toHaveBeenCalledWith([FILE_UPLOAD_MOCK]);
      expect(mockedDeleteImageArray).toHaveBeenCalledWith(["updated.jpg"]);

      // images on the imagesToDelete array
      expect(mockedDeleteImageArray).not.toHaveBeenCalledWith(["test-1.jpg"]);
      expect(mockedDeleteImageArray).toHaveBeenCalledTimes(1);
    }
  });
});
