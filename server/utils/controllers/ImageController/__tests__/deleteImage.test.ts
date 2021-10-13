import fs from "fs";

import { mocked } from "ts-jest/utils";

import deleteImage from "../deleteImage";

import { getBasePath } from "../";

jest.mock("../", () => ({
  IMAGE_DIRECTORY: "/image/dir/",
  getBasePath: jest.fn()
}));

describe("server/utils/controllers/ImageController/deleteImage", () => {
  const getBasePathMocked = mocked(getBasePath);

  const unlinkSpy = jest.spyOn(fs.promises, "unlink");

  beforeEach(() => {
    jest.resetAllMocks();

    getBasePathMocked.mockReturnValue("/basepath/image.webp");
  });

  it("should call fs.promises.unlink", async () => {
    await deleteImage("/tests/image.webp");

    expect(getBasePathMocked).toHaveBeenCalledWith("/tests/image.webp");
    expect(unlinkSpy).toHaveBeenCalledWith("/image/dir/basepath/image.webp");
  });

  it("shuldn't throw an error when the error is an ENOENT error", async () => {
    unlinkSpy.mockRejectedValue({ code: "ENOENT" });

    await deleteImage("");
  });

  it("should throw an error when an error appears", async () => {
    const errorMock = new Error("test error");
    unlinkSpy.mockRejectedValue(errorMock);

    try {
      await deleteImage("");
    } catch (err) {
      expect(err).toEqual(errorMock);
    }
  });
});
