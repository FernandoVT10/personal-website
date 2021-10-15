import { gql } from "apollo-server-express";

import ProjectController from "../utils/controllers/ProjectController";

export const ProjectSchema = gql`
  type ProjectImageSpec {
    width: Int
    height: Int
    url: String
  }

  type ProjectImageObject {
    _id: ID
    imageSpecs: [ProjectImageSpec]
  }

  type Project {
    _id: ID,
    title: String,
    images: [ProjectImageObject]
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
    project(projectId: ID!): Project
    relatedProjects(projectId: ID!, limit: Int): [Project]
  }

  input CreateProjectInput {
    title: String!
    images: [Upload!]!
    description: String!
    content: String!
    technologies: [String]!
  }

  input UpdateProjectInput {
    title: String!
    imagesIdsToDelete: [ID!]
    newImages: [Upload!]
    description: String!
    content: String!
    technologies: [String]!
  }

  extend type Mutation {
    createProject(project: CreateProjectInput!): Project
    updateProject(projectId: ID!, project: UpdateProjectInput!): Project
    deleteProject(projectId: ID!): Project
  }
`;

export const ProjectResolvers = {
  Query: {
    projects: ProjectController.getAll,
    project: ProjectController.getOne,
    relatedProjects: ProjectController.getRelatedProjects
  },
  Mutation: {
    createProject: ProjectController.createOne,
    updateProject: ProjectController.updateOne,
    deleteProject: ProjectController.deleteOne
  }
}
