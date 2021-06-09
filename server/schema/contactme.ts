import { gql } from "apollo-server-express";

import { MY_EMAIL, WEBSITE_URL } from "../config";

import loadMailTemplate from "../utils/loadMailTemplate";
import transporter from "../utils/mailTransporter";

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
  let mailTemplate = loadMailTemplate("sendMessage", {
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
