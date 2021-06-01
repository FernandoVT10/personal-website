import { imageValidator } from "../validators";

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
});
