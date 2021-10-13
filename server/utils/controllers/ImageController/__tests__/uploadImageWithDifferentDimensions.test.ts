import fs from "fs";
import sharp from "sharp";

import { UserInputError, ApolloError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";
import { PassThrough } from "stream";

import saveFileStream from "../../../saveFileStream";

import { imageValidator } from "../../../validators";

import { getWebsiteURL } from "../";

import * as TestModule from "../uploadImageWithDifferentDimensions";

jest.mock("sharp");

jest.mock("../../../saveFileStream");
jest.mock("../../../validators");

jest.mock("../", () => ({
  IMAGE_DIRECTORY: "/test/",
  generateRandomName: () => "random-name",
  getWebsiteURL: jest.fn()
}));

const IMAGE_BUFFER_MOCK = Buffer.from("test");

const IMAGE_MOCK = {
  filename: "test.png",
  mimetype: "image/png",
  createReadStream: () => "test read stream"
} as any;

const SIZES_MOCK = [
  { width: 500, height: 500 },
  { width: 1000, height: 1000 }
]

console.log = () => {}

describe("server/utils/controllers/ImageController/uploadImageWithDifferentDimensions", () => {
  const uploadImageWithDifferentDimensions = TestModule.default;

  const imageValidatorMocked = mocked(imageValidator);
  const getWebsiteURLMocked = mocked(getWebsiteURL);
  const saveFileStreamMocked = mocked(saveFileStream);
  const sharpMocked = mocked(sharp);

  const mkdirSpy = jest.spyOn(fs.promises, "mkdir");
  const createBufferFromStreamSpy = jest.spyOn(TestModule, "createBufferFromStream");
  const getOriginalSizeFromSharpSpy = jest.spyOn(TestModule, "getOriginalSizeFromSharp");

  const sharpResizeMock = jest.fn();
  const sharpWebpMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    imageValidatorMocked.mockReturnValue(true);
    getWebsiteURLMocked.mockReturnValue("test website url");

    sharpResizeMock.mockReturnValue({ webp: sharpWebpMock });
    sharpWebpMock.mockReturnValue("test webp");
    sharpMocked.mockImplementation(() => ({
      webp: sharpWebpMock,
      resize: sharpResizeMock
    } as any));

    createBufferFromStreamSpy.mockResolvedValue(IMAGE_BUFFER_MOCK);
    getOriginalSizeFromSharpSpy.mockResolvedValue({ width: 100, height: 100 });
  });

  it("should return the image specifications", async () => {
    const imageSpecs = await uploadImageWithDifferentDimensions(IMAGE_MOCK, "/foo/", SIZES_MOCK);

    expect(mkdirSpy).toHaveBeenCalledWith("/test/foo/", { recursive: true });

    // this function is called with the ReadStream returned by the createReadStream function
    expect(createBufferFromStreamSpy).toHaveBeenCalledWith("test read stream");

    // SIZES IMAGE GENERATION

    SIZES_MOCK.forEach(size => {
      const testImagePath = `/test/foo/random-name-${size.width}.webp`;

      expect(sharpResizeMock).toHaveBeenCalledWith(size.width, size.height);

      // this is called with the value returned by sharp.web function
      expect(saveFileStreamMocked).toHaveBeenCalledWith("test webp", testImagePath);

      expect(getWebsiteURLMocked).toHaveBeenCalledWith(testImagePath);
    });

    // ORIGINAL IMAGE GENERATION
    
    // this directory is created with the IMAGE_DIRECTORY variable, the folder parameter
    // and the random name generated with the generateRandomName function
    const testImagePath = "/test/foo/random-name.webp";

    // this needs to be called with the value returned by the createBufferFromStream function
    // and be called 3 times, 2 times for the two SIZES and 1 for the original size
    expect(sharpMocked).toHaveBeenCalledWith(IMAGE_BUFFER_MOCK);
    expect(sharpMocked).toHaveBeenCalledTimes(3);

    expect(sharpWebpMock).toHaveBeenCalled();
    expect(sharpWebpMock).toHaveBeenCalledTimes(3);

    expect(saveFileStreamMocked).toHaveBeenCalledWith("test webp", testImagePath);

    // this function is going to be called with the value retuned by sharp.webp
    expect(getOriginalSizeFromSharpSpy).toHaveBeenCalledWith("test webp");

    expect(getWebsiteURLMocked).toHaveBeenCalledWith(testImagePath);

    expect(imageSpecs).toEqual([
      { width: 500, height: 500, url: "test website url" },
      { width: 1000, height: 1000, url: "test website url" },
      { width: 100, height: 100, url: "test website url" }
    ]);
  });

  it("should throw an error when the file isn't an image", async () => {
    imageValidatorMocked.mockReturnValue(false);

    try {
      await uploadImageWithDifferentDimensions(IMAGE_MOCK, "", SIZES_MOCK);
    } catch (err) {
      expect(imageValidatorMocked).toHaveBeenCalledWith(IMAGE_MOCK.mimetype);
      expect(err).toEqual(new UserInputError("The file must be an image"));
    }
  });

  it("should throw an error when an error appears in the execution", async () => {
    mkdirSpy.mockRejectedValue(new Error(""));

    try {
      await uploadImageWithDifferentDimensions(IMAGE_MOCK, "", []);
    } catch (err) {
      expect(imageValidatorMocked).toHaveBeenCalledWith(IMAGE_MOCK.mimetype);
      expect(err).toEqual(new ApolloError(`Error trying to upload the ${IMAGE_MOCK.filename} image to the server.`));
    }
  });

  describe("getOriginalSizeFromSharp", () => {
    beforeEach(() => jest.restoreAllMocks());

    it("should return the width and height correctly", async () => {
      const sharpMock = {
        metadata: jest.fn()
      } as any;

      const result = TestModule.getOriginalSizeFromSharp(sharpMock);

      // get the callback from the mock and call it
      const callback = sharpMock.metadata.mock.calls[0][0];
      callback(null, { width: 100, height: 100 });

      expect(await result).toEqual({ width: 100, height: 100 });
    });

    it("should reject when the metadata function returns an error", async () => {
      const errorMock = new Error("test");
      const sharpMock = {
        metadata: jest.fn()
      } as any;

      const result = TestModule.getOriginalSizeFromSharp(sharpMock);

      const callback = sharpMock.metadata.mock.calls[0][0];
      callback(errorMock, null);

      try {
        await result;
      } catch (err) {
        expect(err).toEqual(errorMock);
      }
    });
  });

  describe("createBufferFromStream", () => {
    const bufferConcatMock = jest.fn();
    Buffer.concat = bufferConcatMock;

    beforeEach(() => {
      jest.restoreAllMocks();

      bufferConcatMock.mockReturnValue("test buffer");
    });

    it("should call Buffer.concat and return its result", async () => {
      const streamMock = new PassThrough;
      const result = TestModule.createBufferFromStream(streamMock as any);

      streamMock.emit("data", "test 1");
      streamMock.emit("data", "test 2");
      streamMock.emit("end");

      expect(await result).toBe("test buffer");

      expect(bufferConcatMock).toHaveBeenCalledWith(["test 1", "test 2"]);
    });

    it("should throw an error when the stream trhows an error", async () => {
      const errorMock = new Error("test error");
      const streamMock = new PassThrough;

      const result = TestModule.createBufferFromStream(streamMock as any);

      streamMock.emit("error", errorMock);

      try {
        expect(await result).toBe("test buffer");
      } catch (err) {
        expect(err).toEqual(errorMock);
      }
    });
  });
});
