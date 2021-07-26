import { AuthenticationError, UserInputError } from "apollo-server-express";

import { Technology } from "../../../models";

import deleteOne from "../deleteOne";

setupTestDB("test_schema_technology_deleteOne");

const TECHNOLOGY_ID_MOCK = "abcdefabcdefabcdefabcdef";

describe("server/schema/technology/deleteOne", () => {
  let technologyId: string;

  beforeEach(async () => {
    const technology = await Technology.create({ name: "technology 1" });
    technologyId = technology._id;
  });

  it("should delete a technology correctly", async () => {
    const deletedTechnology = await deleteOne(null, { technologyId }, { loggedIn: true });

    expect(deletedTechnology.name).toBe("technology 1");

    expect(await Technology.exists({ _id: deletedTechnology._id })).toBeFalsy();
  });

  it("should throw an error when the technologyId doesn't exist", async () => {
    try {
      await deleteOne(null, { technologyId: TECHNOLOGY_ID_MOCK }, { loggedIn: true });
    } catch(err) {
      expect(err).toEqual(new UserInputError(`The technology "${TECHNOLOGY_ID_MOCK}" doesn't exist`));
    }
  });

  it("should throw an error when the user isn't logged in", async () => {
    try {
      await deleteOne(null, { technologyId: null }, { loggedIn: false });
    } catch(err) {
      expect(err).toEqual(new AuthenticationError("You don't have enough permissions"));
    }
  });
  
});
