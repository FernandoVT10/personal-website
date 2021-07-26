import { AuthenticationError, ValidationError, UserInputError } from "apollo-server-express";

import { Technology } from "../../../models";

import updateOne from "../updateOne";

setupTestDB("test_schema_technology_updateOne");

const TECHNOLOGY_ID_MOCK = "abcdefabcdefabcdefabcdef";

describe("server/schema/technology/deleteOne", () => {
  let technologyId: string;

  beforeEach(async () => {
    const technology = await Technology.create({ name: "technology 1" });
    technologyId = technology._id;
  });

  it("should update a technology correctly", async () => {
    const updatedTechnology = await updateOne(null, { technologyId, name: "technology updated" }, { loggedIn: true });

    const technology = await Technology.findById(updatedTechnology._id);

    expect(updatedTechnology.name).toBe("technology updated");
    expect(technology.name).toBe("technology updated");
  });

  it("should throw an error when the technologyId doesn't exist", async () => {
    try {
      await updateOne(null, { technologyId: TECHNOLOGY_ID_MOCK, name: "" }, { loggedIn: true });
    } catch(err) {
      expect(err).toEqual(new UserInputError(`The technology "${TECHNOLOGY_ID_MOCK}" doesn't exist`));
    }
  });

  it("should throw an error when the user isn't logged in", async () => {
    try {
      await updateOne(null, { technologyId: null, name: null }, { loggedIn: false });
    } catch(err) {
      expect(err).toEqual(new AuthenticationError("You don't have enough permissions"));
    }
  });

  it("should throw an error when the technology name already exists", async () => {
    try {
      await updateOne(null, { technologyId, name: "technology 1" }, { loggedIn: true });
    } catch(err) {
      expect(err).toEqual(new ValidationError(`The technology "technology 1" already exists`));
    }
  });
});
