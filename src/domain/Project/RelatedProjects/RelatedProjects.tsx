import React from "react";
import Link from "next/link";

import ResponsiveImage, { ImageSpec } from "@/components/ResponsiveImage";

import styles from "./RelatedProjects.module.scss";

export interface IRelatedProject {
  _id: string
  title: string
  images: {
    imageSpecs: ImageSpec[]
  }[]
}

interface RelatedProjectsProps {
  relatedProjects: IRelatedProject[]
}

const RelatedProjects = ({ relatedProjects }: RelatedProjectsProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.relatedProjects}>
        {relatedProjects.map((relatedProject, index) => {
          if(!relatedProject.images.length) return null;

          return (
            <div className={styles.relatedProject} key={index}>
              <ResponsiveImage
                imageSpecs={relatedProject.images[0].imageSpecs}
                sizes="(max-width: 992px) 350px, 25vw"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover"
                }}
                alt="Related Project Image"
              />
              <Link href={`/projects/${relatedProject._id}`}>
                <a className={styles.title}>{ relatedProject.title }</a>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RelatedProjects;
