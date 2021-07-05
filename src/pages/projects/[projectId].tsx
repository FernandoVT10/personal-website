import React from "react";

import { gql } from "@apollo/client";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import client from "@/config/apolloClient";

import Project, { ProjectProps } from "@/domain/Project";

const RELATED_PROJECTS_LIMIT = 6;

export const GET_PROJECT = gql`
  query GetProject($projectId: ID!) {
    project(projectId: $projectId) {
      title
      images
      content
      technologies {
        name
      }
    }
  }
`;

export const GET_RELATED_PROJECTS = gql`
  query GetRelatedProjects($limit: Int!) {
    projects(limit: $limit) {
      docs {
        _id
        title
        images
      }
    }
  }
`;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { projectId } = ctx.params;

  try {
    const projectResult = await client.query<{ project: ProjectProps["project"] }>({
      query: GET_PROJECT,
      variables: {
        projectId
      }
    });

    const relatedProjectsResult = await client.query<{
      projects: {
        docs: ProjectProps["relatedProjects"]
      }
    }>({
      query: GET_RELATED_PROJECTS,
      variables: {
        limit: RELATED_PROJECTS_LIMIT
      }
    });

    return {
      props: {
        project: projectResult.data.project,
        relatedProjects: relatedProjectsResult.data.projects.docs,
        error: false
      }
    } 
  } catch {
    return {
      props: {
        project: null,
        relatedProjects: null,
        error: true
      }
    }
  }
}

export default function ProjectPage({ project, relatedProjects, error }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Head>
        <title>{ project ? project.title : "Project Not Found" } - Fernando Vaca Tamayo</title>
      </Head>

      <Project project={project} relatedProjects={relatedProjects} error={error} />
    </div>
  );
}
