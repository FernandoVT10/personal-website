import { Error as MongooseError } from "mongoose";

import { AuthenticationError, UserInputError, ApolloError } from "apollo-server-express";

import { mocked } from "ts-jest/utils";

import { Project, Technology } from "../../../../models";

import { uploadImagesWithDifferentDimensions } from "../../ImageController";

import createOne from "../createOne";

jest.mock("../../ImageController");

jest.mock("../", () => ({
  PROJECT_IMAGES_SIZES: [
    { width: 100, height: 100 },
    { width: 500, height: 500 },
    { width: 1000, height: 1000 }
  ]
}));

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

// deactivate the console.log
console.log = () => {}

describe("server/utils/controllers/ProjectController/createOne", () => {
  const PROJECT_IMAGES_SIZES_MOCK = [
    { width: 100, height: 100 },
    { width: 500, height: 500 },
    { width: 1000, height: 1000 }
  ];

  const UPLOAD_IMAGES_WDD_RESPONSE_MOCK = [
    [
      { width: 100, height: 100, url: "https://test/test-100.webp" },
      { width: 500, height: 500, url: "https://test/test-500.webp" },
      { width: 1000, height: 1000, url: "https://test/test-1000.webp" }
    ]
  ];

  const uploadImagesWDDMocked = mocked(uploadImagesWithDifferentDimensions);

  beforeEach(async () => {
    jest.resetAllMocks();

    await Technology.insertMany(MOCK_TECHNOLOGIES);
    uploadImagesWDDMocked.mockResolvedValue(UPLOAD_IMAGES_WDD_RESPONSE_MOCK);
  });

  it("should create a project", async () => {
    const project = await createOne(null, { project: PROJECT_MOCK }, {  loggedIn: true });

    expect(await Project.exists({ _id: project._id })).toBeTruthy();

    expect(project.title).toBe("test title");
    expect(project.description).toBe("test description");
    expect(project.content).toBe("test content");

    expect(project.technologies[0].name).toBe("technology 1");
    expect(project.technologies[1].name).toBe("technology 2");
    expect(project.technologies).toHaveLength(2);

    // here it's important to convert the project to a object,
    // to avoid problems with the types
    expect(project.toObject().images[0].imageSpecs).toEqual(
      UPLOAD_IMAGES_WDD_RESPONSE_MOCK[0]
    );

    expect(uploadImagesWDDMocked).toHaveBeenCalledWith(
      [FILE_UPLOAD_MOCK], "/projects/", PROJECT_IMAGES_SIZES_MOCK
    );
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

  it("shouldn't upload the images when there's a validation error", async () => {
    try {
      await createOne(null, {
        project: {
          ...PROJECT_MOCK,
          title: ""
        }
      }, { loggedIn: true });
    } catch(err) {
      expect(err).toBeInstanceOf(MongooseError.ValidationError);
      expect(uploadImagesWDDMocked).not.toHaveBeenCalled();
    }
  });

  it("should throw an error when there's an error uploading the images", async () => {
    uploadImagesWDDMocked.mockRejectedValue(new Error("test"));

    try {
      await createOne(null, {
        project: PROJECT_MOCK
      }, { loggedIn: true });
    } catch(err) {
      expect(err).toEqual(new ApolloError("An error has appeared creating the project"));
    }
  });
});
