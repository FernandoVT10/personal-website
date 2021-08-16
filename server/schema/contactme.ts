import { gql, UserInputError } from "apollo-server-express";

import { MY_EMAIL, WEBSITE_URL } from "../config";

import sendMessageMailTemplate from "../utils/mailTemplates/sendMessage";

import loadMailTemplate from "../utils/loadMailTemplate";
import transporter from "../utils/mailTransporter";
import { emailValidator } from "../utils/validators";

export const ContactMe = gql`
  extend type Mutation {
    sendMessage(name: String!, email: String!, subject: String!, message: String!): Boolean
  }
`;

interface Parameters {
  name: string,
  email: string,
  subject: string,
  message: string
}

const sendMessage = async (_: null, args: Parameters) => {
  if(!emailValidator(args.email)) throw new UserInputError("The email is invalid");

  let mailTemplate = loadMailTemplate(sendMessageMailTemplate, {
    name: args.name,
    websiteURL: WEBSITE_URL,
    message: args.message
  });

  await transporter.sendMail({
    from: args.email,
    to: MY_EMAIL,
    subject: `Fernando Vaca Tamayo - ${args.subject}`,
    html: mailTemplate
  });

  return true;
}

export const contactMeResolvers = {
  Mutation: {
    sendMessage
  }
}
