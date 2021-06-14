import React from "react";

import Head from "next/head";

import Projects from "@/domain/Projects";

export default function ProjectsPage() {
  return (
    <div>
      <Head>
        <title>My Projects - Fernando Vaca Tamayo</title>
      </Head>

      <Projects/>
    </div>
  )
}
