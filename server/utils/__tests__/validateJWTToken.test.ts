import { mocked } from "ts-jest/utils";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import validateJWTToken from "../validateJWTToken";

jest.mock("jsonwebtoken");

jest.mock("bcrypt");

jest.mock("../../config", () => ({
  DASHBOARD_USERNAME: "username",
  DASHBOARD_PASSWORD: "password",
  JWT_SECRET_KEY: "secret"
}));

const jwtVerifyMocked = mocked(jwt.verify);
const bcryptCompareMocked = mocked(bcrypt.compare);

describe("server/utils/validateJWTToken", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    jwtVerifyMocked.mockImplementation(() => ({
      username: "username",
      password: "password"
    }));

    bcryptCompareMocked.mockImplementation(() => Promise.resolve(true));
  });

  it("should return true", async () => {
    expect(await validateJWTToken("test token")).toBeTruthy();

    expect(jwtVerifyMocked).toHaveBeenCalledWith("test token", "secret");
    expect(bcryptCompareMocked).toHaveBeenCalledWith("password", "password");
  });

  it("should return false when the jsonwebtoken.verify throws an error", async () => {
    jwtVerifyMocked.mockImplementation(() => {
      throw new Error("test error");
    });

    expect(await validateJWTToken("test token")).toBeFalsy();

    expect(jwtVerifyMocked).toHaveBeenCalledWith("test token", "secret");
    expect(bcryptCompareMocked).not.toHaveBeenCalled();
  });

  it("should return false when the bcrypt.compare returns false", async () => {
    bcryptCompareMocked.mockImplementation(() => Promise.resolve(false));

    expect(await validateJWTToken("test token")).toBeFalsy();

    expect(jwtVerifyMocked).toHaveBeenCalledWith("test token", "secret");
    expect(bcryptCompareMocked).toHaveBeenCalledWith("password", "password");
  });

  it("should return false when the username is incorrect", async () => {
    jwtVerifyMocked.mockImplementation(() => ({
      username: "root",
      password: "password"
    }));

    expect(await validateJWTToken("test token")).toBeFalsy();

    expect(jwtVerifyMocked).toHaveBeenCalledWith("test token", "secret");
    expect(bcryptCompareMocked).toHaveBeenCalledWith("password", "password");
  });
});
