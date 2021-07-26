import { gql } from "apollo-server-express";

export const CheckLoginStatus = gql`
  extend type Query {
    checkLoginStatus: Boolean!
  }
`;

const checkLoginStatus = async (_: null, _args: null, context: { loggedIn: boolean }): Promise<boolean> => {
  return context.loggedIn;
}

export const checkLoginStatusResolvers = {
  Query: {
    checkLoginStatus
  }
}
