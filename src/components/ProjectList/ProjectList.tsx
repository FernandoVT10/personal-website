import React from "react";

import { ApolloQueryResult } from "@apollo/client";

import MessageCard from "@/components/MessageCard";

import ProjectCard from "./ProjectCard";

import styles from "./ProjectList.module.scss";
import Loader from "../Loader";

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
  const { error, data, loading } = projectsResult;

  if(loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader/>
      </div>
    );
  }

  if(error) {
    return (
      <div className={styles.messageCardContainer}>
        <MessageCard type="error" message="There was an error trying to display the projects. Try it again later."/>
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