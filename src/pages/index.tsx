import React from "react";

import { gql } from "@apollo/client";

import { InferGetServerSidePropsType } from "next";
import Head from "next/head";

import Home from "@/domain/Home";

import client from "@/config/apolloClient";

export const GET_PROJECTS = gql`
  query GetProjects {
    projects(limit: 3) {
      docs {
        _id
        title
        description
        images
        technologies {
          name
        }
      }
    }
  }
`;

export async function getServerSideProps() {
  const projectsResult = await client.query({
    query: GET_PROJECTS,
    fetchPolicy: "network-only"
  });

  return {
    props: {
      projectsResult
    }
  }
}

export default function HomePage({ projectsResult }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Head>
        <title>Fernando Vaca Tamayo</title>
      </Head>

      <Home projectsResult={projectsResult} />
    </div>
  )
}
