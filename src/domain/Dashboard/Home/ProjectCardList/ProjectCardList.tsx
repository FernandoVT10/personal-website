import React from "react";

import { ApolloQueryResult } from "@apollo/client";
import Link from "next/link";

import Carousel from "@/components/Carousel";
import MessageCard from "@/components/MessageCard";
import Loader from "@/components/Loader";

import styles from "./ProjectCardList.module.scss";

interface IProject {
  _id: string
  title: string
  images: string[]
}

interface ProjectCardListProps {
  queryResult: ApolloQueryResult<{
    projects: {
      docs: IProject[]
    }
  }>
}

const ProjectCardList = ({ queryResult }: ProjectCardListProps) => {
  if(queryResult.loading) {
    return  <Loader/>;
  }

  if(queryResult.error) {
    return  <MessageCard type="error" message="There was an error trying to display the projects. Try it again later."/>;
  }

  const projects = queryResult.data.projects.docs;

  return (
    <div className={styles.projectCardList}>
      { projects.map(project => {
          return (
            <div className={styles.projectCard} key={project._id}>
              <Carousel images={project.images}/>

              <div className={styles.details}>
                <h3 className={styles.title}>{ project.title }</h3>

                <div className={styles.actionButtons}>
                  <Link href={`/dashboard/project/${project._id}/edit`}>
                    <a className={styles.actionButton}>
                      Edit
                    </a>
                  </Link>

                  <a href="#" className={styles.actionButton}>
                    Delete
                  </a>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ProjectCardList;
