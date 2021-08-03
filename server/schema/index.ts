import { gql, makeExecutableSchema } from "apollo-server-express";
import { merge } from "lodash";

import { Project, projectResolvers } from "./project";
import { ContactMe, contactMeResolvers } from "./contactme";
import { TechnologySchema, technologyResolvers } from "./technology";
import { Login, loginResolvers } from "./login";
import { CheckLoginStatus, checkLoginStatusResolvers } from "./checkLoginStatus";
import { UploadImageSchema, UploadImageResolvers } from "./uploadImage";

const Query = gql`
  scalar Upload

  type Query {
    _emtpy: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [ Query, Project, ContactMe, TechnologySchema, Login, CheckLoginStatus, UploadImageSchema ];

const resolvers = merge(projectResolvers, contactMeResolvers, technologyResolvers, loginResolvers, checkLoginStatusResolvers, UploadImageResolvers);

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
