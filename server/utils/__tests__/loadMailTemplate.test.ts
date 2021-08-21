import { readFileSync } from "fs";

import { mocked } from "ts-jest/utils";

import loadMailTemplate from "../loadMailTemplate";

jest.mock("fs");

const TEMPLATE_MOCK = "Hello this is a test created by {testValue} and {otherTestValue}";

const mockedReadFileSync = mocked(readFileSync);

describe("server/utils/loadMailTemplate", () => {
  beforeEach(() => {
    mockedReadFileSync.mockReset();

    mockedReadFileSync.mockImplementation(() => ({
      toString: () => TEMPLATE_MOCK
    } as any));
  });

  it("should return a template with the variables value correctly", () => {
    const template = loadMailTemplate(TEMPLATE_MOCK, {
      testValue: "jhon",
      otherTestValue: "eric"
    });

    expect(template).toBe("Hello this is a test created by jhon and eric");

    const mockCall = mockedReadFileSync.mock.calls[0];

    expect(mockCall[0]).toMatch("mailTemplates/test.html");
  });
});
