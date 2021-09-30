import React from "react";

import Link from "next/link";

import MarkDown from "@/components/MarkDown";

import ErrorPage from "@/components/ErrorPage";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";

import RelatedProjects, { IRelatedProject } from "./RelatedProjects";

import styles from "./Project.module.scss";

export interface ProjectProps {
  project: {
    title: string
    images: string[]
    content: string,
    technologies: { name: string }[]
  },
  relatedProjects: IRelatedProject[],
  error: boolean
}

const Project = ({ project, relatedProjects, error }: ProjectProps) => {
  if(error) {
    return <ErrorPage statusCode="404" error="Project not found" />;
  }

  const projectContainerClass = !relatedProjects.length ? styles.fullWidth : "";

  return (
    <div>
      <Navbar/>

      <div className={styles.container}>
        <div className={`${styles.projectContainer} ${projectContainerClass}`} data-testid="project-container">
          <Carousel images={project.images}/>

          <h1 className={styles.title}>{ project.title }</h1>

          <div className={styles.content}>
            <MarkDown content={project.content}/>
          </div>

          { project.technologies.length > 0 &&
          <div className={styles.technologiesContainer}>
            <i className={`${styles.tagIcon} fas fa-code`} aria-hidden="true"></i>

            {project.technologies.map((technology, index) => {
              return (
                <Link href={`/projects?technology=${technology.name}`} key={index}>
                  <a className={styles.technology}>{ technology.name } </a>
                </Link>
              );
            })}
          </div>
          }
        </div>

        { relatedProjects.length > 0 &&
        <div className={styles.relatedProjectsContainer}>
          <h3 className={styles.subtitle}>Related Projects</h3>

          <div className={styles.relatedProjects}>
            <RelatedProjects relatedProjects={relatedProjects}/>
          </div>
        </div>
        }
      </div>

      <Footer/>
    </div>
  );
}

export default Project;
