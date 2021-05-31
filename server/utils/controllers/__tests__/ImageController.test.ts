import fs from "fs";

import { UserInputError } from "apollo-server-errors";

import ImageController from "../ImageController";

jest.mock("../../saveFileStream", () => () => {});

jest.mock("../../../config", () => ({
  WEBSITE_URL: "https://test.com",
  PUBLIC_DIRECTORY: "./test/"
}));

const FILE_UPLOADS_MOCK = [
  {
    filename: "file-1.png",
    mimetype: "image/png",
    createReadStream: () => {}
  },
  {
    filename: "file-2.jpg",
    mimetype: "image/jpg",
    createReadStream: () => {}
  }
] as any;

const mockedExistSync = jest.spyOn(fs, "existsSync");
const mockedUnlinkSync = jest.spyOn(fs, "unlinkSync");

describe("server/utils/controllers/ImageController", () => {
  beforeEach(() => {
    mockedExistSync.mockReset();
    mockedUnlinkSync.mockReset();
  });

  describe("uploadFileUploadAsImage", () => {
    it("should throw an error when the file type is not supported", async () => {
      try {
        await ImageController.uploadFileUploadAsImage({
          filename: "file-1.webp",
          mimetype: "image/webp",
          createReadStream: () => {}
        } as any);
      } catch (err) {
         expect(err).toEqual(new UserInputError("The file must be a .png, .jpg or .jpeg image")) ;
      }
    });

    it("should return the image url", async () => {
      Date.now = () => 123;

      expect(
        await ImageController.uploadFileUploadAsImage({
          filename: "file-1.jpg",
          mimetype: "image/jpeg",
          createReadStream: () => {}
        } as any)
      ).toBe("https://test.com/img/uploads/123file-1.jpg");
    });
  });

  describe("uploadFileUploadArrayAsImages", () => {
    it("should throw an error when there is a file that is not an image", async () => {
      try {
        await ImageController.uploadFileUploadArrayAsImages([{
          filename: "file-1.jpg",
          mimetype: "image/jpeg",
          createReadStream: () => {}
        }] as any);
      } catch (err) {
        expect(err).toEqual(new UserInputError("All the files must be a .png, .jpg or .jpeg image")) ;
      }
    });

    it("should return the images url", async () => {
      Date.now = () => 321;

      expect(
        await ImageController.uploadFileUploadArrayAsImages(FILE_UPLOADS_MOCK)
      ).toEqual([
        "https://test.com/img/uploads/321file-1.png",
        "https://test.com/img/uploads/321file-2.jpg"
      ]);
    });
  });

  describe("deleteImage", () => {
    it("should call fs.existsSync and fs.unlinkSync correctly", () => {
      mockedExistSync.mockImplementation(() => true);

      ImageController.deleteImage("https://test.com/img/uploads/test-file.jpg");

      expect(mockedExistSync).toHaveBeenCalledWith("test/img/uploads/test-file.jpg");
      expect(mockedUnlinkSync).toHaveBeenCalledWith("test/img/uploads/test-file.jpg");
    });
  });

  describe("deleteImageArray", () => {
    it("should call fs.unlinkSync 2 times", () => {
      mockedExistSync.mockImplementation(() => true);

      ImageController.deleteImageArray([
        "https://test.com/img/uploads/test-file.jpg",
        "https://test.com/img/uploads/test-file-2.jpg"
      ]);

      expect(mockedUnlinkSync).toHaveBeenCalledWith("test/img/uploads/test-file.jpg");
      expect(mockedUnlinkSync).toHaveBeenCalledWith("test/img/uploads/test-file-2.jpg");
    });
  });
});
