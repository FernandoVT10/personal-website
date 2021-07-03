import React from "react";

import Link from "next/link";

import MarkDown from "@/components/MarkDown";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";

import styles from "./Project.module.scss";

export interface IProject {
  title: string
  images: string[]
  content: string,
  technologies: { name: string }[]
}

interface ProjectProps {
  project: IProject
  error: boolean
}

const Project = ({ project, error }: ProjectProps) => {
  if(error && !project) { return null }

  return (
    <div>
      <Navbar/>

      <div className={styles.container}>
        <div className={styles.projectContainer}>
          <Carousel images={project.images}/>

          <h1 className={styles.title}>{ project.title }</h1>

          <div className={styles.content}>
            <MarkDown content={project.content}/>
          </div>

          <div className={styles.technologiesContainer}>
            <i className={`${styles.tagIcon} fas fa-tag`} aria-hidden="true"></i>

            {project.technologies.map((technology, index) => {
              return (
                <Link href={`/projects?technology=${technology.name}`} key={index}>
                  <a className={styles.technology}>{ technology.name } </a>
                </Link>
              );
            })}
          </div>
        </div>

        <div className={styles.relatedProjectsContainer}></div>
      </div>

      <Footer/>
    </div>
  );
}

export default Project;
