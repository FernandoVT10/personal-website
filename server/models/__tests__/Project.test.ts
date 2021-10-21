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
  it("should create a project", async () => {
    const imageSpecsMock = [
      { width: 100, height: 100, url: "https://test/test.webp" }
    ];
    
    const project = await Project.create({
      title: "test title",
      images: [
        {
          imageSpecs: imageSpecsMock
        }
      ],
      description: "test description",
      content: "test content",
      technologies: []
    } as any);

    expect(project.title).toBe("test title");
    expect(project.toObject().images[0].imageSpecs).toEqual(imageSpecsMock);
    expect(project.description).toBe("test description");
    expect(project.content).toBe("test content");
  });

  describe("title field", () => {
    it("should throw an error when the title length is greater than 100 characters", async () => {
      try {
        await Project.create({
          title: generateText(101),
          description: "description",
          content: "content"
        } as any);
      } catch (err) {
        expect(err.errors.title.toString()).toBe("The title must be less than 100 characters");
      }
    });

    it("should throw an error when the title is empty", async () => {
      try {
        await Project.create({
          title: "",
          description: "description",
          content: "content"
        } as any);
      } catch (err) {
        expect(err.errors.title.toString()).toBe("The title is required");
      }
    });
  });

  describe("description field", () => {
    it("should throw an error when the description length is greater than 250 characters", async () => {
      try {
        await Project.create({
          title: "title",
          description: generateText(251),
          content: "content"
        } as any);
      } catch (err) {
        expect(err.errors.description.toString()).toBe("The description must be less than 250 characters");
      }
    });

    it("should throw an error when the description is empty", async () => {
      try {
        await Project.create({
          title: "title",
          description: "",
          content: "content"
        } as any);
      } catch (err) {
        expect(err.errors.description.toString()).toBe("The description is required");
      }
    });
  });

  describe("content field", () => {
    it("should throw an error when the content is empty", async () => {
      try {
        await Project.create({
          title: "title",
          description: "description",
          content: ""
        } as any);
      } catch (err) {
        expect(err.errors.content.toString()).toBe("The content is required");
      }
    });
  });
});
