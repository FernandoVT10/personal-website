import { mocked } from "ts-jest/utils";
import { UserInputError } from "apollo-server-errors";

import loadMailTemplate from "../../utils/loadMailTemplate";
import transporter from "../../utils/mailTransporter";

import { contactMeResolvers } from "../contactme";

jest.mock("../../config", () => ({
  MY_EMAIL: "myemail@example.com",
  MAIL_CONFIG: {},
  WEBSITE_URL: "testwebsiteurl"
}))

jest.mock("../../utils/mailTransporter");
jest.mock("../../utils/loadMailTemplate");

const mockedTransporterSendMail = mocked(transporter.sendMail);
const mockedLoadMailTemplate = mocked(loadMailTemplate);

describe("server/schema/contactme", () => {
  beforeEach(() => {
    mockedTransporterSendMail.mockReset();
    mockedLoadMailTemplate.mockReset();

    mockedLoadMailTemplate.mockImplementation(() => "test template");
  });

  it("should call transporter.sendMail correctly", () => {
    const result = contactMeResolvers.Mutation.sendMessage(null, {
      name: "testname",
      email: "test@example.com",
      subject: "testsubject",
      message: "test message"
    })

    expect(result).toBeTruthy();

    expect(mockedLoadMailTemplate).toHaveBeenCalledWith("sendMessage", {
      websiteURL: "testwebsiteurl",
      name: "testname",
      message: "test message"
    });

    expect(mockedTransporterSendMail).toHaveBeenCalledWith({
      from: "test@example.com",
      to: "myemail@example.com",
      subject: "Fernando Vaca Tamayo - testsubject",
      html: "test template"
    });
  });

  it("should throw an error when the email is invalid", () => {
    try {
      contactMeResolvers.Mutation.sendMessage(null, {
        name: "testname",
        email: "test@example.com",
        subject: "testsubject",
        message: "test message"
      });
    } catch (err) {
      expect(err).toEqual(new UserInputError("The email is invalid"));
    }
  });
});
