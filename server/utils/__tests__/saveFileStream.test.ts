import fs from "fs";

import saveFileStream from "../saveFileStream";

const FILE_STREAM_MOCK = {
  on: jest.fn().mockImplementation(() => console.log("holi")),
  pipe: jest.fn(),
} as any;

const mockedCreateWriteStream = jest.spyOn(fs, "createWriteStream");

describe("server/utils/saveFileStream", () => {
  beforeEach(() => {
    mockedCreateWriteStream.mockReset();

    FILE_STREAM_MOCK.on.mockReset();
    FILE_STREAM_MOCK.pipe.mockReset();

    FILE_STREAM_MOCK.on.mockImplementation((type: string, cb: () => {}) => {
      if(type === "finish") {
        cb();
      }
      return FILE_STREAM_MOCK
    });
    FILE_STREAM_MOCK.pipe.mockImplementation(() => FILE_STREAM_MOCK);
  });

  it("should return the path", async () => {
    mockedCreateWriteStream.mockImplementation(() => null);

    expect(await saveFileStream(FILE_STREAM_MOCK, "/test/path")).toBe("/test/path");

    expect(mockedCreateWriteStream).toHaveBeenCalledWith("/test/path");

    expect(FILE_STREAM_MOCK.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(FILE_STREAM_MOCK.on).toHaveBeenCalledTimes(3);

    expect(FILE_STREAM_MOCK.pipe).toHaveBeenCalled();
  });
});
