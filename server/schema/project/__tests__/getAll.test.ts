import { Project, Technology } from "../../../models";

import getAll from "../getAll";

const TECHNOLOGIES_MOCK = [
  { name: "technology 1" },
  { name: "technology 2" },
  { name: "technology 3" }
];

const PROJECTS_MOCK = [
  {
    title: "project 1",
    images: ["project-1-1.jpg", "project-1-2.jpg"],
    description: "project 1 description",
    content: "project 1 content",
    technologies: [],
    createdAt: Date.now() - 2
  },
  {
    title: "project 2",
    images: ["project-2-1.jpg", "project-2-2.jpg"],
    description: "project 2 description",
    content: "project 2 content",
    technologies: [],
    createdAt: Date.now() - 1
  },
  {
    title: "project 3",
    images: ["project-3-1.jpg", "project-3-2.jpg"],
    description: "project 3 description",
    content: "project 3 content",
    technologies: [],
    createdAt: Date.now()
  }
];

setupTestDB("test_schema_project_getAll");

describe("server/schema/project/getAll", () => {
  beforeEach(async () => {
    const technologies = await Technology.create(TECHNOLOGIES_MOCK);

    // this add a technology to each project
    technologies.forEach((technology, index) => {
      PROJECTS_MOCK[index].technologies = [technology._id];
    });

    await Project.create(PROJECTS_MOCK);
  });

  it("should return all the projects", async () => {
    const { docs } = await getAll(null, {} as any);

    expect(docs[0].title).toBe("project 3");
    docs[0].images.forEach((image, index) => {
      expect(image).toEqual(PROJECTS_MOCK[2].images[index]);
    });
    expect(docs[0].description).toBe("project 3 description");
    expect(docs[0].content).toBe("project 3 content");
    expect(docs[0].technologies[0].name).toBe("technology 3");

    expect(docs[1].title).toBe("project 2");
    docs[1].images.forEach((image, index) => {
      expect(image).toEqual(PROJECTS_MOCK[1].images[index]);
    });
    expect(docs[1].description).toBe("project 2 description");
    expect(docs[1].content).toBe("project 2 content");
    expect(docs[1].technologies[0].name).toBe("technology 2");

    expect(docs[2].title).toBe("project 1");
    docs[2].images.forEach((image, index) => {
      expect(image).toEqual(PROJECTS_MOCK[0].images[index]);
    });
    expect(docs[2].description).toBe("project 1 description");
    expect(docs[2].content).toBe("project 1 content");
    expect(docs[2].technologies[0].name).toBe("technology 1");
  });

  it("should return only 1 project with the limit parameter", async () => {
    const { docs } = await getAll(null, { limit: 1 } as any);

    expect(docs).toHaveLength(1);

    expect(docs[0].title).toBe("project 3");
  });

  it("should return only 1 project and skip 2 with the limit and page parameter", async () => {
    const { docs } = await getAll(null, { limit: 1, page: 3 } as any);

    expect(docs).toHaveLength(1);

    expect(docs[0].title).toBe("project 1");
  });

  describe("technology parameter", () => {
    it("should return only 1 project", async () => {
      const { docs } = await getAll(null, { technology: "technology 3" } as any);

      expect(docs).toHaveLength(1);

      expect(docs[0].title).toBe("project 3");
    });

    it("shouldn't return projects when the technology doesn't exist", async () => {
      const { docs } = await getAll(null, { technology: "technology 20" } as any);

      expect(docs).toHaveLength(0);
    });
  });

  describe("search parameter", () => {
    it("should return a project", async () => {
      const { docs } = await getAll(null, { search: "PrOjeCT 2" } as any);

      expect(docs).toHaveLength(1);

      expect(docs[0].title).toBe("project 2");
    }); 

    it("should return the projects that match the search", async () => {
      const { docs } = await getAll(null, { search: "pro" } as any);

      expect(docs).toHaveLength(3);

      expect(docs[0].title).toBe("project 3");
      expect(docs[1].title).toBe("project 2");
      expect(docs[2].title).toBe("project 1");
    }); 
  });
});
