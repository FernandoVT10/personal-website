import { Error as MongooseError } from "mongoose";
import { ApolloError, AuthenticationError, UserInputError } from "apollo-server-errors";
import { mocked } from "ts-jest/utils";

import { Project, IProject, Technology } from "../../../../models";

import { uploadImagesWithDifferentDimensions, deleteImages } from "../../ImageController";

import updateOne from "../updateOne";

import { PROJECT_IMAGES_SIZES } from "../";

jest.mock("../../ImageController");

jest.mock("../", () => ({
  PROJECT_IMAGES_SIZES: [
    { width: 100, height: 100 },
    { width: 500, height: 500 },
    { width: 1000, height: 1000 }
  ]
}));

setupTestDB("test_utils_controllers_project_updateOne");

// deactivate the console.log
console.log = () => {}

describe("server/utils/controllers/ProjectController/updateOne", () => {
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
    images: [
      {
        imageSpecs: [
          { width: 100, height: 100, url: "https://test/original-100.webp" },
          { width: 500, height: 500, url: "https://test/original-500.webp" },
          { width: 1000, height: 1000, url: "https://test/original-1000.webp" }
        ]
      }
    ]
  }

  const UPLOAD_IMAGES_WDD_RESPONSE_MOCK = [
    [
      { width: 100, height: 100, url: "https://test/test-100.webp" },
      { width: 500, height: 500, url: "https://test/test-500.webp" },
      { width: 1000, height: 1000, url: "https://test/test-1000.webp" }
    ]
  ];

  const uploadImagesWDDMocked = mocked(uploadImagesWithDifferentDimensions);
  const deleteImagesMocked = mocked(deleteImages);

  let project: IProject;

  beforeEach(async () => {
    jest.resetAllMocks();

    const technologies = await Technology.create(MOCK_TECHNOLOGIES);

    PROJECT_MOCK.technologies = [
      technologies.find(({ name }) => name === "technology 1"),
      technologies.find(({ name }) => name === "technology 2")
    ];

    project = await Project.create(PROJECT_MOCK);

    uploadImagesWDDMocked.mockResolvedValue(UPLOAD_IMAGES_WDD_RESPONSE_MOCK);
  });

  it("should update a project correctly", async () => {
    // get all the images ids from the project
    const imagesIdsToDelete = project.images.map(image => image._id.toString());

    const updatedProject = await updateOne(null, {
      projectId: project._id,
      project: {
        title: "updated title",
        description: "updated description",
        content: "updated content",
        technologies: ["technology 3"],
        imagesIdsToDelete,
        newImages: [
          { promise: Promise.resolve(FILE_UPLOAD_MOCK) }
        ]
      }
    }, { loggedIn: true });

    expect(updatedProject.title).toBe("updated title");
    expect(updatedProject.description).toBe("updated description");
    expect(updatedProject.content).toBe("updated content");

    expect(updatedProject.technologies[0].name).toBe("technology 3");
    expect(updatedProject.technologies).toHaveLength(1);

    expect(updatedProject.toObject().images[0].imageSpecs).toEqual(
      UPLOAD_IMAGES_WDD_RESPONSE_MOCK[0]
    );

    expect(uploadImagesWDDMocked).toHaveBeenCalledWith(
      [FILE_UPLOAD_MOCK], "/projects/", PROJECT_IMAGES_SIZES
    );

    // here i wanna get the imageURLs from the project mock
    // and check that deleteImages was called correctly
    const imageURLs = PROJECT_MOCK.images[0].imageSpecs.map(imageSpec => imageSpec.url);
    expect(deleteImagesMocked).toHaveBeenCalledWith(imageURLs);
  });

  it("shouldn't call deleteImages when the imagesToDelete array is empty", async () => {
    uploadImagesWDDMocked.mockResolvedValue([]);

    const updatedProject = await updateOne(null, {
      projectId: project._id,
      project: {
        title: "updated title",
        description: "updated description",
        content: "updated content",
        technologies: ["technology 1", "technology 3"],
        imagesIdsToDelete: [],
        newImages: []
      }
    }, { loggedIn: true });

    expect(updatedProject.toObject().images[0].imageSpecs).toEqual(
      PROJECT_MOCK.images[0].imageSpecs
    );

    expect(deleteImagesMocked).toHaveBeenCalledWith([]);
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

  it("should throws a validation error", async () => {
    try {
      await updateOne(null, {
        projectId: project._id,
        project: {
          title: "",
          description: "updated description",
          content: "updated content",
          technologies: ["technology 1", "technology 3"],
          imagesIdsToDelete: [],
          newImages: [
            { promise: Promise.resolve(FILE_UPLOAD_MOCK) }
          ]
        }
      }, { loggedIn: true });   
    } catch(err) {
      // images on the newImages array
      expect(uploadImagesWDDMocked).not.toHaveBeenCalled();

      // images on the imagesToDelete array
      expect(deleteImagesMocked).not.toHaveBeenCalled();

      expect(err).toBeInstanceOf(MongooseError.ValidationError);
    }
  });

  it("should throw an error when there's an error uploading the images", async () => {
    uploadImagesWDDMocked.mockReset();
    uploadImagesWDDMocked.mockRejectedValue(new Error("test error"));

    try {
      await updateOne(null, {
        projectId: project._id,
        project: {
          title: "updated title",
          description: "updated description",
          content: "updated content",
          technologies: ["technology 1", "technology 3"],
          newImages: [
            { promise: Promise.resolve(FILE_UPLOAD_MOCK) }
          ]
        }
      }, { loggedIn: true });   
    } catch(err) {
      expect(err).toEqual(new ApolloError("An error has appeared creating the project"));
    }
  });
});
