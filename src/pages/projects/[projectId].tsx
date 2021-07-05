import React from "react";

import { gql } from "@apollo/client";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import client from "@/config/apolloClient";

import Project, { ProjectProps } from "@/domain/Project";

const RELATED_PROJECTS_LIMIT = 6;

export const GET_PROJECT = gql`
  query GetProject($projectId: ID!, $limit: Int) {
    project(projectId: $projectId) {
      title
      images
      content
      technologies {
        name
      }
    }

    relatedProjects(projectId: $projectId, limit: $limit) {
      _id
      title
      images
    }
  }
`;

interface IQueryResult {
  project: ProjectProps["project"]
  relatedProjects: ProjectProps["relatedProjects"]
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { projectId } = ctx.params;

  try {
    const queryResult = await client.query<IQueryResult>({
      query: GET_PROJECT,
      variables: {
        projectId,
        limit: RELATED_PROJECTS_LIMIT
      }
    });

    const { project, relatedProjects } = queryResult.data;

    return {
      props: {
        project,
        relatedProjects,
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
