import { mocked } from "ts-jest/utils";

import fs from "fs";

import ImageController from "../ImageController";
import saveFileStream from "../../saveFileStream";

import { UserInputError, ApolloError } from "apollo-server-express";

const sharpWebpMock = jest.fn();

jest.mock("sharp", () => () => ({
  webp: sharpWebpMock
}));

jest.mock("../../saveFileStream");

jest.mock("../../../config", () => ({
  WEBSITE_URL: "https://test.com",
  PUBLIC_DIRECTORY: "/public/"
}));

const FILE_UPLOADS_MOCK = [
  {
    filename: "file-1.png",
    mimetype: "image/png",
    createReadStream: () => ({ pipe: jest.fn() })
  },
  {
    filename: "file-2.jpg",
    mimetype: "image/jpg",
    createReadStream: () => ({ pipe: jest.fn() })
  }
] as any;

// deactivate the console error
// console.error = () => {}

Date.now = () => 1;

describe("server/utils/controllers/ImageController", () => {
  const mockedSaveFileStream = mocked(saveFileStream);

  const mkdirSpy = jest.spyOn(fs.promises, "mkdir");
  const unlinkSpy = jest.spyOn(fs.promises, "unlink");
  const mathRandomSpy = jest.spyOn(Math, "random");

  // this is the name of the file that the generateRandomName function will return
  const returnedImageName = "1234567.webp";

  beforeEach(() => {
    jest.resetAllMocks();

    sharpWebpMock.mockReturnValue("sharp webp pipeline");
    mkdirSpy.mockResolvedValue(null);
    unlinkSpy.mockResolvedValue(null);
    mathRandomSpy.mockReturnValue(0.234567);
  });

  describe("uploadImage", () => {

    it("should call sharp.webp and return the image url", async () => {
      const pipeMock = jest.fn();

      const fileMock = {
        ...FILE_UPLOADS_MOCK[0],
        createReadStream: () => ({ pipe: pipeMock })
      }

      expect(await ImageController.uploadImage(fileMock)).toBe(`https://test.com/img/uploads/${returnedImageName}`);

      expect(sharpWebpMock).toHaveBeenCalled();
      expect(pipeMock).toHaveBeenCalledWith("sharp webp pipeline");

      expect(mkdirSpy).toHaveBeenCalledWith("/public/img/uploads/", { recursive: true });
      expect(mockedSaveFileStream).toHaveBeenCalledWith("sharp webp pipeline", `/public/img/uploads/${returnedImageName}`);
    });

    it("should return the image url with a specific folder", async () => {
      expect(
        await ImageController.uploadImage(FILE_UPLOADS_MOCK[0], "/tests/")
      ).toBe(`https://test.com/img/uploads/tests/${returnedImageName}`);

      expect(mkdirSpy).toHaveBeenCalledWith("/public/img/uploads/tests/", { recursive: true });
      expect(mockedSaveFileStream).toHaveBeenCalledWith("sharp webp pipeline", `/public/img/uploads/tests/${returnedImageName}`);
    });

    it("should throw an error when the file type is not supported", async () => {
      try {
        await ImageController.uploadImage({
          filename: "file-1.html",
          mimetype: "text/html",
        } as any);
      } catch (err) {
         expect(err).toEqual(new UserInputError("The file must be a .png, .jpg or .jpeg image")) ;
      }
    });

    it("should throw an error when something throws an error", async () => {
      try {
        await ImageController.uploadImage(FILE_UPLOADS_MOCK[0]);

        mockedSaveFileStream.mockRejectedValue(new Error("test error"));
      } catch (err) {
         expect(err).toEqual(new ApolloError("Error trying to upload the file-1.png image to the server.")) ;
      }
    });
  });

  describe("uploadImages", () => {
    it("should return the image urls", async () => {
      expect(await ImageController.uploadImages(FILE_UPLOADS_MOCK)).toEqual([
        `https://test.com/img/uploads/${returnedImageName}`,
        `https://test.com/img/uploads/${returnedImageName}`
      ]);
    });

    it("should throw an error when there is a file type not supported", async () => {
      try {
        await ImageController.uploadImages([{
          filename: "file-1.html",
          mimetype: "text/html",
        }] as any);
      } catch (err) {
        expect(err).toEqual(new UserInputError("All the files must be a .png, .jpg or .jpeg image")) ;
      }
    });

    it("should return an empty array when we pass an empty array as parameter", async () => {
      const imageURLs = await ImageController.uploadImages([]);
      expect(imageURLs).toEqual([]);
    });
  });

  describe("deleteImage", () => {
    it("should call fs.promises.unlink", async () => {
      await ImageController.deleteImage("https://test.com/img/uploads/tests/file-1.png");
      expect(unlinkSpy).toHaveBeenCalledWith("/public/img/uploads/tests/file-1.png");
    });

    it("shouldn't throw an error if it is an ENOENT error", async () => {
      unlinkSpy.mockRejectedValue({ code: "ENOENT" });

      await ImageController.deleteImage("https://test.com/img/uploads/tests/file-1.png");
    });

    it("should throw an error if it isn't an ENOENT error", async () => {
      const errorMock = new Error("test error");

      try {
        unlinkSpy.mockRejectedValue(errorMock);

        await ImageController.deleteImage("https://test.com/img/uploads/tests/file-1.png");
      } catch (err) {
        expect(err).toEqual(errorMock);
      }
    });
  });

  describe("deleteImages", () => {
    it("should call the deleteImage function correctly", async () => {
      const imagesMock = [
        "https://test.com/img/uploads/test-file.jpg",
        "https://test.com/img/uploads/test-file-2.jpg"
      ];

      await ImageController.deleteImages(imagesMock);

      expect(unlinkSpy).toHaveBeenCalledTimes(2);
    });

    it("should do nothing when we pass an empty array as parameter", async () => {
      await ImageController.deleteImages([]);
      expect(unlinkSpy).not.toHaveBeenCalled();
    });

    it("should throw an error when something throws an error", async () => {
      try {
        unlinkSpy.mockRejectedValue(new Error("test error"));

        await ImageController.deleteImages([
          "https://test.com/img/uploads/test-file.jpg",
          "https://test.com/img/uploads/test-file-2.jpg"
        ]);
      } catch (err) {
        expect(err).toEqual(new ApolloError("Error trying to delete the images"));
      }
    });
  });
});
