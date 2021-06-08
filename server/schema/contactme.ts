import { gql } from "apollo-server-express";

import { MY_EMAIL } from "../config";

import transporter from "../utils/mailTransporter";

export const ContactMe = gql`
  extend type Mutation {
    sendMessage(email: String!, message: String!): Boolean
  }
`;

interface Parameters {
  email: string,
  message: string
}

const sendMessage = async (_: null, args: Parameters) => {
  await transporter.sendMail({
    from: args.email,
    to: MY_EMAIL,
    subject: `Fernando Vaca Tamayo - A new message from ${args.email}`,
    text: args.message
  });

  return true;
}

export const contactMeResolvers = {
  Mutation: {
    sendMessage
  }
}
