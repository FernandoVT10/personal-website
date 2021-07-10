import { gql, UserInputError } from "apollo-server-express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { DASHBOARD_USERNAME, DASHBOARD_PASSWORD, JWT_SECRET_KEY } from "../config";

const EXPIRES_IN_30_DAYS = 60 * 60 * 24 * 30;

export const Login = gql`
  extend type Mutation {
    login(username: String!, password: String!): String!
  }
`;

interface Parameters {
  username: string
  password: string
}

const login = async (_: null, args: Parameters) => {
  const { username, password } = args;

  if(username !== DASHBOARD_USERNAME) throw new UserInputError("The username is incorrect");

  const checkPassword = await bcrypt.compare(password, DASHBOARD_PASSWORD);
  if(!checkPassword) throw new UserInputError("The password is incorrect");

  const token = jwt.sign({ username, password }, JWT_SECRET_KEY, { expiresIn: EXPIRES_IN_30_DAYS });

  return token;
}

export const loginResolvers = {
  Mutation: {
    login
  }
}
