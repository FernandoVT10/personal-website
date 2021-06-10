import { emailValidator, imageValidator } from "../validators";

describe("/server/utils/validators", () => {
  describe("imageValidator", () => {
    it("should return true when the image type is jpg, jpeg or png", () => {
      ["image/jpg", "image/jpeg", "image/png"].forEach(imageType => {
        expect(imageValidator(imageType)).toBeTruthy();
      });
    });

    it("should return false when the image type is not allowed", () => {
      expect(imageValidator("image/webp")).toBeFalsy();
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
