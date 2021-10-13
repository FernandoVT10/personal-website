import { ApolloError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";

import deleteImage from "../deleteImage";
import deleteImages from "../deleteImages";

jest.mock("../deleteImage");

describe("server/utils/controllers/ImageController/deleteImages", () => {
  const deleteImageMocked = mocked(deleteImage);

  beforeEach(() => jest.resetAllMocks());

  it("should call the deleteImage function with the correct data", async () => {
    const imagesURLsMock = [
      "http://test/uploads/test.png",
      "http://test/uploads/test-2.png"
    ];

    await deleteImages(imagesURLsMock);

    imagesURLsMock.forEach(imageURL => {
      expect(deleteImageMocked).toHaveBeenCalledWith(imageURL);
    });
    expect(deleteImageMocked).toHaveBeenCalledTimes(imagesURLsMock.length);
  });

  it("should throw an error when an error appears", async () => {
    try {
      await deleteImages(["https://test/test.png"]);
    } catch (err) {
      expect(err).toEqual(new ApolloError("Error trying to delete the images"));
    }
  });

  it("should do nothing when the array is empty", async () => {
    await deleteImages([]);
    expect(deleteImageMocked).not.toHaveBeenCalled();
  });
});
