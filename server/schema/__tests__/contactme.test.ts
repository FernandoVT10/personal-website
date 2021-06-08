import { mocked } from "ts-jest/utils";

import transporter from "../../utils/mailTransporter";

import { contactMeResolvers } from "../contactme";

jest.mock("../../config", () => ({
  MY_EMAIL: "myemail@example.com",
  MAIL_CONFIG: {}
}))

jest.mock("../../utils/mailTransporter");

const mockedTransporterSendMail = mocked(transporter.sendMail);

describe("server/schema/contactme", () => {
  beforeEach(() => {
    mockedTransporterSendMail.mockReset();
  });

  it("should call transporter.sendMail correctly", () => {
    const result = contactMeResolvers.Mutation.sendMessage(null, {
      email: "test@example.com",
      message: "test message"
    })

    expect(result).toBeTruthy();

    expect(mockedTransporterSendMail).toHaveBeenCalledWith({
      from: "test@example.com",
      to: "myemail@example.com",
      subject: "Fernando Vaca Tamayo - A new message from test@example.com",
      text: "test message"
    });
  });
});
