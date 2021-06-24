import { Technology } from "../../../models";

import getAll from "../getAll";

setupTestDB("test_schema_technology_getAll");

const TECHNOLOGIES_MOCK = [
  { name: "technology 1" },
  { name: "technology 2" },
  { name: "technology 3" },
];

describe("server/schema/technology/getAll", () => {
  beforeEach(async () => {
    await Technology.create(TECHNOLOGIES_MOCK);
  });

  it("should get all the technologies", async () => {
    const result = await getAll();

    const technologies = await Technology.find();

    technologies.forEach((technology, index) => {
      expect(result[index].name).toBe(technology.name);
    });
  });
});
