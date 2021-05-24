import React from "react";

import { gql, useQuery, ApolloQueryResult } from "@apollo/client";

import MessageCard from "@/components/MessageCard";

import ProjectCard from "./ProjectCard";

import styles from "./ProjectList.module.scss";

interface Project {
  _id: string
  title: string
  description: string
  images: string[]
}

export interface ProjectsData {
  projects: {
    docs: Project[]
  }
}

const ProjectList = ({ projectsResult }: { projectsResult: ApolloQueryResult<ProjectsData> }) => {
  const { error, data } = projectsResult;

  if(error) {
    return (
      <div className={styles.messageCardContainer}>
        <MessageCard type="error" message={error.graphQLErrors[0].message}/>
      </div>
    );
  }

  if(!data.projects.docs.length) {
    return (
      <div className={styles.messageCardContainer}>
        <MessageCard type="info" message="There are not projects to display."/>
      </div>
    );
  }

  return (
    <div className={styles.projectList}>
      {data.projects.docs.map((project, index) => {
        return (
          <div className={styles.projectCard} key={index}>
            <ProjectCard project={project} />
          </div>
        );
      })}
    </div>
  );
}

export default ProjectList;
