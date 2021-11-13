import fs from "fs";
import sharp from "sharp";

import { UserInputError, ApolloError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";

import saveFileStream from "../../../saveFileStream";

import { imageValidator } from "../../../validators";

import uploadImage from "../uploadImage";

import { getWebsiteURL } from "../";

jest.mock("sharp");

jest.mock("../../../saveFileStream");
jest.mock("../../../validators");
jest.mock("../", () => ({
  IMAGE_DIRECTORY: "/test/",
  generateRandomName: () => "random-name",
  getWebsiteURL: jest.fn()
}));

const IMAGE_MOCK = {
  mimetype: "image/png",
  filename: "test.png",
  createReadStream: jest.fn()
} as any;

console.error = () => {}

describe("server/utils/controllers/ImageController/uploadImage", () => {
  const sharpMocked = mocked(sharp);
  const imageValidatorMocked = mocked(imageValidator);
  const getWebsiteURLMocked = mocked(getWebsiteURL);
  const saveFileStreamMocked = mocked(saveFileStream);

  const mkdirSpy = jest.spyOn(fs.promises, "mkdir");

  const pipeMock = jest.fn();
  const sharpWebpMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    imageValidatorMocked.mockReturnValue(true);
    getWebsiteURLMocked.mockReturnValue("test website url");

    IMAGE_MOCK.createReadStream.mockReturnValue({
      pipe: pipeMock
    });

    sharpMocked.mockImplementation(() => ({
      webp: sharpWebpMock
    } as any));
  });

  it("should return the image url correctly", async () => {
    sharpWebpMock.mockReturnValue("test webp");

    const imageURL = await uploadImage(IMAGE_MOCK, "/foo/");
    expect(imageURL).toBe("test website url");

    expect(mkdirSpy).toHaveBeenCalledWith("/test/foo/", { recursive: true });

    // this is the pipe that returns the createReadStream function
    expect(pipeMock).toHaveBeenCalledWith("test webp");

    expect(saveFileStreamMocked).toHaveBeenCalledWith("test webp", "/test/foo/random-name.webp");
    expect(getWebsiteURLMocked).toHaveBeenCalledWith("/test/foo/random-name.webp");
  });

  it("should throw an error when the imageValidator function returns false", async () => {
    try {
      imageValidatorMocked.mockReturnValue(false);
      await uploadImage(IMAGE_MOCK);
    } catch (err) {
      expect(err).toEqual(new UserInputError("The file must be an image"));
    }
  });

  it("should throw an error when an error appears in the execution", async () => {
    mkdirSpy.mockRejectedValue(new Error("test error"));

    try {
      await uploadImage(IMAGE_MOCK);
    } catch (err) {
      expect(err).toEqual(new ApolloError("Error trying to upload the test.png image to the server."));
    }
  });
});
