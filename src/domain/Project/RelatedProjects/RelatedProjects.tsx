import Link from "next/link";
import React from "react";

import styles from "./RelatedProjects.module.scss";

export interface IRelatedProject {
  _id: string
  title: string,
  images: string[]
}

interface RelatedProjectsProps {
  relatedProjects: IRelatedProject[]
}

const RelatedProjects = ({ relatedProjects }: RelatedProjectsProps) => {
  return (
    <div className={styles.relatedProjects}>
      {relatedProjects.map((relatedProject, index) => {
        return (
          <div className={styles.relatedProject} key={index}>
            <img
              src={relatedProject.images[0]}
              className={styles.image}
              alt="Related Project Image"
            />
            <Link href={`/projects/${relatedProject._id}`}>
              <a className={styles.title}>{ relatedProject.title }</a>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default RelatedProjects;
