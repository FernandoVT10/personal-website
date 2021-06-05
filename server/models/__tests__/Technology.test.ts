import Technology from "../Technology";

setupTestDB("test_models_Technology");

describe("server/models/Technology", () => {
  it("should create a technology correctly", async () => {
    const technology = await Technology.create({ name: "test" });
    expect(technology.name).toBe("test");
  });

  it("should throw an error when the name is empty", async () => {
    try {
      await Technology.create({ name: "" });
    } catch(err) {
      expect(err.errors.name.toString()).toBe("The name is required");
    }
  });
});
