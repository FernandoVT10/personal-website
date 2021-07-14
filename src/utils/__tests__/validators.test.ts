import { email,  imageValidator } from "../validators";

describe("src/utils/validators", () => {
  describe("image validator", () => {
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
      expect(email("test@gc")).toBe("The email is invalid");
      expect(email("test@gmail.s")).toBe("The email is invalid");
    });

    it("should return null when the email is valid", () => {
      expect(email("test@example.com")).toBeNull();
      expect(email("test@example.es")).toBeNull();
      expect(email("test_12@e.es")).toBeNull();
      expect(email("test_12@super.example")).toBeNull();
    });
  });
});
