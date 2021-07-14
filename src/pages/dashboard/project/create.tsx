import React from "react";

import Head from "next/head";

import CreateProject from "@/domain/Dashboard/Project/CreateProject";

const CreateProjectPage = () => {
  return (
    <>
      <Head>
        <title>Create a project - Dashboard</title>
      </Head>

      <CreateProject/>
    </>
  );
}

export default CreateProjectPage;
