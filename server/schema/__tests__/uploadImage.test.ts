import { AuthenticationError } from "apollo-server-errors";
import { mocked } from "ts-jest//utils";

import { UploadImageResolvers } from "../uploadImage";

import ImageController from "../../utils/controllers/ImageController";

jest.mock("../../utils/controllers/ImageController");

const IMAGE_MOCK = {
  promise: Promise.resolve({
    filename: "test name",
    mimetype: "image/jpg"
  })
} as any;

const uploadImageMocked = mocked(ImageController.uploadImage);

describe("server/schema/uploadImage", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return the image url", async () => {
    uploadImageMocked.mockResolvedValue("https://example.com/image.jpg");

    expect(
      await UploadImageResolvers.Mutation.uploadImage(null, { image: IMAGE_MOCK }, { loggedIn: true })
    ).toBe("https://example.com/image.jpg");

    expect(uploadImageMocked).toHaveBeenCalledWith({
      filename: "test name",
      mimetype: "image/jpg"
    });
  });

  it("should throw an error when the user isn't logged in", async () => {
    try {
      await UploadImageResolvers.Mutation.uploadImage(null, { image: null }, { loggedIn: false })
    } catch (err) {
      expect(err).toEqual(new AuthenticationError("You don't have enough permissions"));
    }
  });
});
