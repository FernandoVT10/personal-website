import Project from "../Project";

setupTestDB("test_models_Project");

const generateText = (n: number) => {
  let result = "";
  while(n > 0) {
    result += "l";
    n--;
  }
  return result;
}

describe("server/models/Project", () => {
  it("should create a project correctly", async () => {
    const project = await Project.create({
      title: "test title",
      images: ["test-1.jpg", "test-2.jpg"],
      description: "test description",
      technologies: []
    });

    expect(project.title).toBe("test title");
    expect([...project.images]).toEqual(["test-1.jpg", "test-2.jpg"]);
    expect(project.description).toBe("test description");
  });

  describe("title field", () => {
    it("should throw an error when the title length is greater than 100 characters", async () => {
      try {
        await Project.create({
          title: generateText(101),
          description: "description"
        });
      } catch (err) {
        expect(err.errors.title.toString()).toBe("The title must be less than 100 characters");
      }
    });

    it("should throw an error when the title is empty", async () => {
      try {
        await Project.create({
          title: "",
          description: "description"
        });
      } catch (err) {
        expect(err.errors.title.toString()).toBe("The title is required");
      }
    });
  });

  describe("description field", () => {
    it("should throw an error when the description is empty", async () => {
      try {
        await Project.create({
          title: "title",
          description: ""
        });
      } catch (err) {
        expect(err.errors.description.toString()).toBe("The description is required");
      }
    });
  });
});
