import { mocked } from "ts-jest/utils";
import { UserInputError } from "apollo-server-express";


import { imageValidator } from "../../../validators";

import uploadImageWithDifferentDimensions from "../uploadImageWithDifferentDimensions";
import uploadImagesWithDifferentDimensions from "../uploadImagesWithDifferentDimensions";

jest.mock("../../../validators");

jest.mock("../uploadImageWithDifferentDimensions");

const IMAGES_MOCK = [
  { filename: "test.png", mimetype: "image/png" },
  { filename: "test-2.png", mimetype: "image/png" }
] as any;

const SIZES_MOCK = [
  { width: 100, height: 100 },
  { width: 200, height: 200 }
]

describe("server/utils/controllers/ImageController/uploadImagesWithDifferentDimensions", () => {
  const uploadImageWithDifferentDimensionsMocked = mocked(uploadImageWithDifferentDimensions);
  const imageValidatorMocked = mocked(imageValidator);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should call the uploadImageWithDifferentDimensions and return the response", async () => {
    imageValidatorMocked.mockReturnValue(true);

    uploadImageWithDifferentDimensionsMocked.mockImplementation(image => {
      return Promise.resolve(image.filename as any);
    });

    const result = await uploadImagesWithDifferentDimensions(IMAGES_MOCK, "/test/", SIZES_MOCK);
    expect(result).toEqual(["test.png", "test-2.png"]);

    IMAGES_MOCK.forEach((image: any) => {
      expect(uploadImageWithDifferentDimensionsMocked).toHaveBeenCalledWith(image, "/test/", SIZES_MOCK);
    });
  });

  it("should throw an error when a file isn't an image", async () => {
    imageValidatorMocked.mockReturnValue(false);

    try {
      await uploadImagesWithDifferentDimensions([
        { filename: "test.png", mimetype: "test/foo" } as any
      ], "", [])
    } catch (err) {
      expect(imageValidatorMocked).toHaveBeenCalledWith("test/foo");
      expect(err).toEqual(new UserInputError("The file test.png isn't an image"));
    }

  });

  it("should return an empty array when we call the function with no images", async() => {
    expect(
      await uploadImagesWithDifferentDimensions([], "", [])
    ).toEqual([]);
  });
});
