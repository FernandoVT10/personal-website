import React from "react";

import { ApolloError } from "@apollo/client";

import { gql, useMutation } from "@apollo/client";

import MessageCard from "@/components/MessageCard";
import Loader from "@/components/Loader";

import ProjectCard, { IProject } from "./ProjectCard";

import styles from "./ProjectCardList.module.scss";

const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId) {
      _id
    }
  }
`;

interface IDeleteProjectResult {
  deleteProject: {
    _id: string
  }
}

interface IDeleteProjectVariables {
  projectId: string
}

interface ProjectCardListProps {
  error: ApolloError,
  loading: boolean,
  projects: IProject[],
  refetchProjects: () => void
}

const ProjectCardList = ({ error, loading, projects, refetchProjects }: ProjectCardListProps) => {
  const [deleteProject] = useMutation<IDeleteProjectResult, IDeleteProjectVariables>(DELETE_PROJECT);

  if(loading) {
    return  <Loader/>;
  }

  if(error) {
    return  <MessageCard type="error" message="There was an error trying to display the projects. Try it again later."/>;
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject({ variables: { projectId } });

      refetchProjects();
    } catch (err) {
      throw err;
    }
  }

  return (
    <div className={styles.projectCardList}>
      { projects.map(project => {
        return <ProjectCard key={project._id} project={project} deleteProject={handleDeleteProject}/>;
      })}
    </div>
  );
}

export default ProjectCardList;
