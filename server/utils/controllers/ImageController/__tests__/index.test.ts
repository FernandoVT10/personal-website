import { generateRandomName, getBasePath, getWebsiteURL } from "../";

jest.mock("../../../../config", () => ({
  PUBLIC_DIRECTORY: "",
  WEBSITE_URL: "https://test.com/"
}));

describe("server/utils/controllers/ProjectController/index", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("generateRandomName", () => {
    const mathRandomSpy = jest.spyOn(Math, "random");
    const dateNowSpy = jest.spyOn(Date, "now");

    beforeEach(() => {
      dateNowSpy.mockReturnValue(1000);
      mathRandomSpy.mockReturnValue(0.1234567);
    });

    it("should generate a random name", () => {
      expect(generateRandomName()).toBe("1000123456");
    });
  });

  describe("getBasePath", () => {
    it("should split the text with the UPLOADS_DIRECTORY variable", () => {
      expect(getBasePath("home/user/img/uploads/test/image.webp")).toBe("/test/image.webp");
    });
  });

  describe("getWebsiteURL", () => {
    it("should return the website url", () => {
      expect(
        getWebsiteURL("home/user/img/uploads/image.webp")
      ).toBe("https://test.com/img/uploads/image.webp");
    });
  });
});
