import loadMailTemplate from "../loadMailTemplate";

const TEMPLATE_MOCK = "Hello this is a test created by {testValue} and {otherTestValue}";

describe("server/utils/loadMailTemplate", () => {
  it("should return a template with the variables value correctly", () => {
    const template = loadMailTemplate(TEMPLATE_MOCK, {
      testValue: "jhon",
      otherTestValue: "eric"
    });

    expect(template).toBe("Hello this is a test created by jhon and eric");
  });
});
