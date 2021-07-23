import { gql } from "apollo-server-express";

import getAll from "./getAll";
import createOne from "./createOne";
import updateOne from "./updateOne";
import deleteOne from "./deleteOne";

export const TechnologySchema = gql`
  type Technology {
    _id: ID
    name: String
  }

  extend type Query {
    technologies: [Technology]
  }

  extend type Mutation {
    createTechnology(name: String!): Technology
    updateTechnology(technologyId: ID!, name: String!): Technology
    deleteTechnology(technologyId: ID!): Technology
  }
`;

export const technologyResolvers = {
  Query: {
    technologies: getAll
  },
  Mutation: {
    createTechnology: createOne,
    updateTechnology: updateOne,
    deleteTechnology: deleteOne
  }
}
