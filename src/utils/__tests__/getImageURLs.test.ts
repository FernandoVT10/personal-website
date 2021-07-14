import getImageURLs from "../getImageURLs";

const FILES_MOCK = [
  new File([], "test 1", { type: "image/png" }),
  new File([], "test 2", { type: "image/jpg" }),
  new File([], "test 3", { type: "image/jpeg" })
];

const readAsDataURLMock = jest.fn();

describe("src/utils/getImageURLs", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    window.FileReader.prototype.readAsDataURL = function (file: File) {
      this.onload({
        target: {
          result: {
            toString: () => `https://${file.name}.jpg`
          }
        }
      });

      readAsDataURLMock(file);
    }
  });

  it("should get the image urls correctly", async () => {
    expect(await getImageURLs(FILES_MOCK)).toEqual([
      "https://test 1.jpg",
      "https://test 2.jpg",
      "https://test 3.jpg"
    ]);

    FILES_MOCK.forEach(file => expect(readAsDataURLMock).toHaveBeenCalledWith(file));

    expect(readAsDataURLMock).toHaveBeenCalledTimes(3);
  });

  it("should return an error", async () => {
    window.FileReader.prototype.readAsDataURL = function (_: File) {
      this.onerror(new Error("test error"));
    }

    try {
      await getImageURLs(FILES_MOCK);
    } catch(err) {
      expect(err).toEqual(new Error("test error"));
    }
  });
});
