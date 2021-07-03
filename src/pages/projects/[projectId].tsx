import React from "react";

import { gql } from "@apollo/client";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import client from "@/config/apolloClient";

import Project, { IProject } from "@/domain/Project";

const GET_PROJECT = gql`
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { projectId } = ctx.params;

  try {
    const projectResult = await client.query<{ project: IProject }>({
      query: GET_PROJECT,
      variables: {
        projectId
      }
    });

    return {
      props: {
        project: projectResult.data.project,
        error: false
      }
    } 
  } catch (err) {
    return {
      props: {
        project: null,
        error: true
      }
    }
  }
}

export default function ProjectPage({ project, error }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Head>
        <title>{ project ? project.title : "Project Not Found" } - Fernando Vaca Tamayo</title>
      </Head>

      <Project project={project} error={error} />
    </div>
  );
}
