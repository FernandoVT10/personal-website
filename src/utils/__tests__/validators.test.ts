import { email } from "../validators";

describe("src/utils/validators", () => {
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
