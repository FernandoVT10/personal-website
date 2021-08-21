import { mocked } from "ts-jest/utils";

import ImageController from "../../utils/controllers/ImageController";

import { getImageHandler } from "../img";

jest.mock("../../utils/controllers/ImageController");

const getImageMocked = mocked(ImageController.getImage);


describe("server/routes/img", () => {
  const req = {
    params: {
      imageKey: "test-key"
    }
  } as any;
  const res = {
    setHeader: jest.fn(),
    send: jest.fn()
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();

    getImageMocked.mockResolvedValue({
      ContentType: "image/jpg",
      Body: "test body"
    } as any);
  });

  it("should return the result of the ImageController.getImage function", async () => {

    await getImageHandler(req, res, jest.fn());

    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "image/jpg");
    expect(res.send).toHaveBeenCalledWith("test body");
  });

  it("should call the next function when there's an error", async () => {
    getImageMocked.mockReset();
    getImageMocked.mockRejectedValue(new Error("test error"));

    const nextFunctionMock = jest.fn();

    await getImageHandler(req, res, nextFunctionMock);

    expect(nextFunctionMock).toHaveBeenCalled();
  });
});
