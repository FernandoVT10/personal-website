import { gql } from "apollo-server-express";

import getAll from "./getAll";

export const TechnolgySchema = gql`
  type Technology {
    _id: ID
    name: String
  }

  extend type Query {
    technologies: [Technology]
  }
`;

export const technologyResolvers = {
  Query: {
    technologies: getAll
  },
  Mutation: {

  }
}
