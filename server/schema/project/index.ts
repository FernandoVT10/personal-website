import { gql } from "apollo-server-express";

import getAll from "./getAll";
import createOne from "./createOne";
import deleteOne from "./deleteOne";

export const Project = gql`
  type Technology {
    name: String
  }

  type Project {
    _id: ID,
    title: String,
    images: [String]
    description: String
    technologies: [Technology]
  }

  extend type PaginateResponse {
    docs: [Project]
  }

  extend type Query {
    projects(search: String, page: Int, limit: Int): PaginateResponse
  }

  input ProjectInput {
    title: String!
    images: [Upload]
    description: String!
    technologies: [ID]
  }

  extend type Mutation {
    createProject(project: ProjectInput!): Project
    deleteProject(projectId: ID!): Project
  }
`;

export const projectResolvers = {
  Query: {
    projects: getAll
  },
  Mutation: {
    createProject: createOne,
    deleteProject: deleteOne
  }
}
