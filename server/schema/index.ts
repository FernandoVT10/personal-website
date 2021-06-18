import { gql, makeExecutableSchema } from "apollo-server-express";
import { merge } from "lodash";

import { Project, projectResolvers } from "./project";
import { ContactMe, contactMeResolvers } from "./contactme";
import { TechnolgySchema, technologyResolvers } from "./technology";

const Query = gql`
  scalar Upload

  type Query {
    _emtpy: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [ Query, Project, ContactMe, TechnolgySchema ];

const resolvers = merge(projectResolvers, contactMeResolvers, technologyResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
