import { emailValidator, imageValidator } from "../validators";

describe("/server/utils/validators", () => {
  describe("imageValidator", () => {
    it("should return true when it's an image type  ", () => {
      ["image/jpg", "image/jpeg", "image/png", "image/webp"].forEach(imageType => {
        expect(imageValidator(imageType)).toBeTruthy();
      });
    });

    it("should return false when it's not an image type", () => {
      expect(imageValidator("file/html")).toBeFalsy();
    });
  });

  describe("email validator", () => {
    it("should return an error when the email is invalid", () => {
      expect(emailValidator("test@gc")).toBeFalsy();
      expect(emailValidator("test@gmail.s")).toBeFalsy();
    });

    it("should return null when the email is valid", () => {
      expect(emailValidator("test@example.com")).toBeTruthy();
      expect(emailValidator("test@example.es")).toBeTruthy();
      expect(emailValidator("test_12@e.es")).toBeTruthy();
      expect(emailValidator("test_12@super.example")).toBeTruthy();
    });
  });
});
