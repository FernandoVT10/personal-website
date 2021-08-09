import { email,  imageValidator, inputValidators } from "../validators";

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
    it("should return false when the email is invalid", () => {
      expect(email("test@gc")).toBeFalsy();
      expect(email("test@gmail.s")).toBeFalsy();
    });

    it("should return true when the email is valid", () => {
      expect(email("test@example.com")).toBeTruthy();
      expect(email("test@example.es")).toBeTruthy();
      expect(email("test_12@e.es")).toBeTruthy();
      expect(email("test_12@super.example")).toBeTruthy();
    });
  });

  describe("inputValidators", () => {
    describe("email", () => {
      it("should return a message when the email is invalid", () => {
        expect(inputValidators.email("test@gmail.s")).toBe("The email is invalid");
      });

      it("shouldn't return a message when the email is valid", () => {
        expect(inputValidators.email("test@gmail.com")).toBeNull();
      });
    });

    describe("requiredInput", () => {
      it("should return a message when the value is empty", () => {
        const validator = inputValidators.requiredInput("test name");
        expect(validator("")).toBe("The test name is required");
      });

      it("should return null when the value isn't empty", () => {
        const validator = inputValidators.requiredInput("test name");
        expect(validator("foo")).toBeNull();
      });
    });
  });
});
