import { AuthenticationError, ValidationError } from "apollo-server-express";

import { Technology } from "../../../models";

import createOne from "../createOne";

setupTestDB("test_schema_technology_createOne");

describe("server/schema/technology/createOne", () => {
  beforeEach(async () => {
    await Technology.create({ name: "technology 1" });
  });

  it("should create a technology correctly", async () => {
    const createdTechnology = await createOne(null, { name: "new technology" }, { loggedIn: true });

    expect(createdTechnology.name).toBe("new technology");

    expect(await Technology.exists({ _id: createdTechnology._id })).toBeTruthy();
  });

  it("should throw an error when the user isn't logged in", async () => {
    try {
      await createOne(null, { name: "" }, { loggedIn: false });
    } catch(err) {
      expect(err).toEqual(new AuthenticationError("You don't have enough permissions"));
    }
  });

  it("should throw an error when the technology name already exists", async () => {
    try {
      await createOne(null, { name: "technology 1" }, { loggedIn: true });
    } catch(err) {
      expect(err).toEqual(new ValidationError(`The technology "technology 1" already exists`));
    }
  });
});
