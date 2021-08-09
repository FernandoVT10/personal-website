import React from "react";

import { gql } from "@apollo/client";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import apolloClient from "@/config/apolloClient";

import EditProject from "@/domain/Dashboard/Project/EditProject";

export const GET_PROJECT = gql`
  query GetProject($projectId: ID!) {
    project(projectId: $projectId) {
      _id
      title
      images
      description
      content
      technologies {
        name
      }
    }
  }
`;

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
  const { projectId } = params;

  try {
    const result = await apolloClient.query({
      query: GET_PROJECT,
      variables: { projectId }
    });

    return {
      props: {
        project: result.data.project,
        error: false
      }
    }
  } catch {
    return {
      props: {
        project: null,
        error: true
      }
    }
  }
}

const EditProjectPage = ({ project, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Edit Project - Dashboard</title>
      </Head>

      <EditProject project={project} error={error} />
    </>
  );
}

export default EditProjectPage;
