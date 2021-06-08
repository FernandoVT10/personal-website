import { gql, makeExecutableSchema } from "apollo-server-express";
import { merge } from "lodash";

import { Project, projectResolvers } from "./project";
import { ContactMe, contactMeResolvers } from "./contactme";

const Query = gql`
  scalar Upload

  type Query {
    _emtpy: String
  }

  type Mutation {
    _empty: String
  }

  type PaginateResponse {
    totalDocs: Int
    limit: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
    page: Int
    totalPages: Int
    offset: Int
    prevPage: Int
    nextPage: Int
  }
`;

const typeDefs = [ Query, Project, ContactMe ];

const resolvers = merge(projectResolvers, contactMeResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
