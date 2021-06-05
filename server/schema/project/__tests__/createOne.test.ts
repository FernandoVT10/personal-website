import { mocked } from "ts-jest/utils";

import { Project, Technology } from "../../../models";

import ImageController from "../../../utils/controllers/ImageController";

import createOne from "../createOne";

jest.mock("../../../utils/controllers/ImageController");

setupTestDB("test_schema_project_createOne");

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
  technologies: ["technology 1", "technology 2", "technology 123"],
  images: [
    {
      promise: Promise.resolve(FILE_UPLOAD_MOCK)
    }
  ]
}

const mockedUploadFileUploadArrayAsImages = mocked(ImageController.uploadFileUploadArrayAsImages);
const mockedDeleteImageArray = mocked(ImageController.deleteImageArray);

describe("server/schema/project/createOne", () => {
  beforeEach(async () => {
    await Technology.create(MOCK_TECHNOLOGIES);

    mockedUploadFileUploadArrayAsImages.mockReset();
    mockedDeleteImageArray.mockReset();

    mockedUploadFileUploadArrayAsImages.mockResolvedValue(["test-1.jpg", "test-2.jpg"]);
  });

  it("should create a project", async () => {
    const project = await createOne(null, { project: PROJECT_MOCK });

    expect(await Project.exists({ _id: project._id })).toBeTruthy();

    expect(project.title).toBe("test title");
    expect(project.description).toBe("test description");

    expect(project.technologies).toHaveLength(2);
    expect(project.technologies[0].name).toBe("technology 1");
    expect(project.technologies[1].name).toBe("technology 2");

    expect([...project.images]).toEqual(["test-1.jpg", "test-2.jpg"]);

    expect(mockedUploadFileUploadArrayAsImages).toHaveBeenCalledWith([FILE_UPLOAD_MOCK]);
  });

  it("should create a project without images", async () => {
    mockedUploadFileUploadArrayAsImages.mockResolvedValue([]);

    const project = await createOne(null, {
      project: {
        ...PROJECT_MOCK,
        images: []
      }
    });

    expect(await Project.exists({ _id: project._id })).toBeTruthy();

    expect(project.title).toBe("test title");
    expect(project.description).toBe("test description");

    expect(project.technologies).toHaveLength(2);
    expect(project.technologies[0].name).toBe("technology 1");
    expect(project.technologies[1].name).toBe("technology 2");

    expect([...project.images]).toHaveLength(0);

    expect(mockedUploadFileUploadArrayAsImages).toHaveBeenCalledWith([]);
  });

  it("should delete all the images when it throws an error", async () => {
    try {
      await createOne(null, {
        project: {
          ...PROJECT_MOCK,
          title: ""
        }
      });
    } catch {
      expect(mockedDeleteImageArray).toHaveBeenCalledWith(["test-1.jpg", "test-2.jpg"]);
    }
  });
});
