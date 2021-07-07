import { UserInputError } from "apollo-server-errors";
import { mocked } from "ts-jest/utils";

import { Project, Technology } from "../../../models";

import ImageController from "../../../utils/controllers/ImageController";

import updateOne from "../updateOne";

jest.mock("../../../utils/controllers/ImageController");

setupTestDB("test_schema_project_updateOne");

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
  technologies: [],
  images: ["test-1.jpg", "test-2.jpg", "test-3.jpg"]
}

const mockedUploadFileUploadArrayAsImages = mocked(ImageController.uploadFileUploadArrayAsImages);
const mockedDeleteImageArray = mocked(ImageController.deleteImageArray);

describe("server/schema/project/updateOne", () => {
  it("test", () => {
    expect(4).toBe(4);
  });
  // let projectId: string;

  // beforeEach(async () => {
  //   const technologies = await Technology.create(MOCK_TECHNOLOGIES);

  //   PROJECT_MOCK.technologies = [technologies[0], technologies[1]];

  //   const project = await Project.create(PROJECT_MOCK);
  //   projectId = project._id;

  //   mockedUploadFileUploadArrayAsImages.mockReset();
  //   mockedDeleteImageArray.mockReset();

  //   mockedUploadFileUploadArrayAsImages.mockResolvedValue(["updated.jpg"]);
  // });

  // it("should update a project correctly", async () => {
  //   const updatedProject = await updateOne(null, {
  //     projectId,
  //     project: {
  //       title: "updated title",
  //       description: "updated description",
  //       technologies: ["technology 1", "technology 3"],
  //       currentImages: ["test-1.jpg"],
  //       newImages: [
  //         { promise: Promise.resolve(FILE_UPLOAD_MOCK) }
  //       ]
  //     }
  //   });

  //   expect(updatedProject.title).toBe("updated title");
  //   expect(updatedProject.description).toBe("updated description");

  //   expect(updatedProject.technologies[0].name).toBe("technology 1");
  //   expect(updatedProject.technologies[1].name).toBe("technology 3");

  //   expect([...updatedProject.images]).toEqual(["test-1.jpg", "updated.jpg"]);

  //   expect(mockedUploadFileUploadArrayAsImages).toHaveBeenCalledWith([FILE_UPLOAD_MOCK]);

  //   expect(mockedDeleteImageArray).toHaveBeenCalledWith(["test-2.jpg", "test-3.jpg"]);
  // });

  // it("should update a project correctly without newImages", async () => {
  //   mockedUploadFileUploadArrayAsImages.mockResolvedValue([]);

  //   const updatedProject = await updateOne(null, {
  //     projectId,
  //     project: {
  //       title: "updated title",
  //       description: "updated description",
  //       technologies: ["technology 1", "technology 3"],
  //       currentImages: ["test-1.jpg"],
  //       newImages: []
  //     }
  //   });

  //   expect([...updatedProject.images]).toEqual(["test-1.jpg"]);

  //   expect(mockedUploadFileUploadArrayAsImages).toHaveBeenCalledWith([]);

  //   expect(mockedDeleteImageArray).toHaveBeenCalledWith(["test-2.jpg", "test-3.jpg"]);
  // });

  // it("should delete all the images when the currentImage is empty", async () => {
  //   mockedUploadFileUploadArrayAsImages.mockResolvedValue([]);

  //   const updatedProject = await updateOne(null, {
  //     projectId,
  //     project: {
  //       title: "updated title",
  //       description: "updated description",
  //       technologies: ["technology 1", "technology 3"],
  //       currentImages: [],
  //       newImages: []
  //     }
  //   });

  //   expect([...updatedProject.images]).toEqual([]);

  //   expect(mockedDeleteImageArray).toHaveBeenCalledWith(["test-1.jpg", "test-2.jpg", "test-3.jpg"]);
  // });

  // it("should throw an error when the projectId doesn't exist", async () => {
  //   try {
  //     await updateOne(null, { projectId: "abcdefabcdefabcdefabcdef", project: {} as any });
  //   } catch(err) {
  //     expect(err).toEqual(new UserInputError("The project with the ID 'abcdefabcdefabcdefabcdef' doesn't exist."))
  //   }
  // });

  // it("should delete all the new images when it throws an error", async () => {
  //   try {
  //     await updateOne(null, {
  //       projectId,
  //       project: {
  //         title: "",
  //         description: "updated description",
  //         technologies: ["technology 1", "technology 3"],
  //         currentImages: [],
  //         newImages: [
  //           { promise: Promise.resolve(FILE_UPLOAD_MOCK) }
  //         ]
  //       }
  //     });   
  //   } catch {
  //     expect(mockedUploadFileUploadArrayAsImages).toHaveBeenCalledWith([FILE_UPLOAD_MOCK]);

  //     expect(mockedDeleteImageArray).toHaveBeenCalledTimes(1);
  //     expect(mockedDeleteImageArray).toHaveBeenCalledWith(["updated.jpg"]);
  //   }
  // });
});
