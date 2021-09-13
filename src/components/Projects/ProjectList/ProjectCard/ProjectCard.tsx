import React from "react";

import Link from "next/link";

import ImagesCarousel from "@/components/Carousel";

import styles from "./ProjectCard.module.scss";

export interface Project {
  _id: string,
  title: string,
  description: string,
  images: string[],
  technologies: {
    name: string
  }[]
}

export interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className={styles.projectCard}>
      <div className={styles.details}>

        <h3 className={styles.title}>{ project.title }</h3>

        { project.technologies.length > 0 &&
        <div className={styles.technologies} data-testid="technologies-container">
          <i className={`${styles.icon} fas fa-code`} aria-hidden="true"></i>

          {project.technologies.map(technology => {
            return (
              <Link href={`/projects?technology=${technology.name}`} key={technology.name}>
                <a className={styles.technology}>{ technology.name }</a>
              </Link>
            );
          })}
        </div>
        }

        <p className={styles.description}>
          { project.description }
        </p>

        <Link href={`/projects/${project._id}`}>
          <a className={styles.seeMore}>
            See More
            <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </a>
        </Link>
      </div>

      <div className={styles.carousel}>
        <ImagesCarousel images={project.images} />
      </div>
    </div>
  );
}

export default ProjectCard;
