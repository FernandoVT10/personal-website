import React from "react";

import { gql } from "@apollo/client";

import { InferGetStaticPropsType } from "next";
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
      }
    }
  }
`;

export async function getStaticProps() {
  const projectsResult = await client.query({
    query: GET_PROJECTS
  });

  return {
    props: {
      projectsResult
    }
  }
}

export default function HomePage({ projectsResult }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <Head>
        <title>Fernando Vaca Tamayo</title>
      </Head>

      <Home projectsResult={projectsResult} />
    </div>
  )
}
