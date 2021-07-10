import { gql, makeExecutableSchema } from "apollo-server-express";
import { merge } from "lodash";

import { Project, projectResolvers } from "./project";
import { ContactMe, contactMeResolvers } from "./contactme";
import { TechnolgySchema, technologyResolvers } from "./technology";
import { Login, loginResolvers } from "./login";
import { CheckLoginStatus, checkLoginStatusResolvers } from "./checkLoginStatus";

const Query = gql`
  scalar Upload

  type Query {
    _emtpy: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [ Query, Project, ContactMe, TechnolgySchema, Login, CheckLoginStatus ];

const resolvers = merge(projectResolvers, contactMeResolvers, technologyResolvers, loginResolvers, checkLoginStatusResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
