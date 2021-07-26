import { mocked } from "ts-jest/utils";

import { UserInputError } from "apollo-server-errors";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { loginResolvers } from "../login";

jest.mock("jsonwebtoken");

jest.mock("bcrypt");

jest.mock("../../config", () => ({
  DASHBOARD_USERNAME: "username",
  DASHBOARD_PASSWORD: "password",
  JWT_SECRET_KEY: "secret"
}));

const jwtSignMocked = mocked(jwt.sign);
const bcryptCompareMocked = mocked(bcrypt.compare);

describe("server/schema/login", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    jwtSignMocked.mockImplementation(() => "test token");
    bcryptCompareMocked.mockImplementation(() => Promise.resolve(true));
  });

  describe("mutation login", () => {
    it("should return the token", async () => {
      const data = { username: "username", password: "password" }

      expect(
        await loginResolvers.Mutation.login(null, data)
      ).toBe("test token");

      expect(bcryptCompareMocked).toHaveBeenCalledWith("password", "password");
      expect(jwtSignMocked).toHaveBeenCalledWith(data, "secret", { expiresIn: 60 * 60 * 24 * 30 });
    });

    it("should throw an error when the username is incorrect", async () => {
      try {
        await loginResolvers.Mutation.login(null, { username: "username 2", password: "password" });
      } catch (err) {
        expect(err).toEqual(new UserInputError("The username is incorrect"));
        expect(bcryptCompareMocked).not.toHaveBeenCalled();
        expect(jwtSignMocked).not.toHaveBeenCalled();
      }
    });

    it("should throw an error when bcrypt.compare returns false", async () => {
      bcryptCompareMocked.mockImplementation(() => Promise.resolve(false));

      try {
        await loginResolvers.Mutation.login(null, { username: "username", password: "password" });
      } catch (err) {
        expect(err).toEqual(new UserInputError("The password is incorrect"));
        expect(bcryptCompareMocked).toHaveBeenCalledWith("password", "password");
        expect(jwtSignMocked).not.toHaveBeenCalled();
      }
    });
  });
});
