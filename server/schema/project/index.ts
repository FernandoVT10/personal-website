import { gql } from "apollo-server-express";

import getAll from "./getAll";
import createOne from "./createOne";
import updateOne from "./updateOne";
import deleteOne from "./deleteOne";

export const Project = gql`
  type Project {
    _id: ID,
    title: String,
    images: [String]
    description: String
    content: String
    technologies: [Technology]
  }

  type ProjectsResponse {
    totalDocs: Int
    limit: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
    page: Int
    totalPages: Int
    offset: Int
    prevPage: Int
    nextPage: Int
    docs: [Project]
  }

  extend type Query {
    projects(search: String, technology: String, page: Int, limit: Int): ProjectsResponse
  }

  input ProjectInput {
    title: String!
    images: [Upload]
    description: String!
    technologies: [ID]
  }

  input UpdateProjectInput {
    title: String!
    currentImages: [String]
    newImages: [Upload]
    description: String!
    technologies: [ID]
  }

  extend type Mutation {
    createProject(project: ProjectInput!): Project
    updateProject(projectId: ID!, project: UpdateProjectInput!): Project
    deleteProject(projectId: ID!): Project
  }
`;

export const projectResolvers = {
  Query: {
    projects: getAll
  },
  Mutation: {
    createProject: createOne,
    updateProject: updateOne,
    deleteProject: deleteOne
  }
}
