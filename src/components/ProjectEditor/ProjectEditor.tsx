import React from "react";

import Carousel from "./Carousel";

import { INewImage } from "./Carousel/ImageList";

import styles from "./ProjectEditor.module.scss";

export interface IProjectEditorProps {
  project: {
    images: string[]
  }
  setImagesToDelete: React.Dispatch<string[]>
  setNewImages: React.Dispatch<INewImage[]>
}

const ProjectEditor = ({
  project,
  setImagesToDelete,
  setNewImages
}: IProjectEditorProps) => {
  return (
    <div className={styles.projectEditor}>
      <Carousel
        images={project.images}
        setImagesToDelete={setImagesToDelete}
        setNewImages={setNewImages}
      />
    </div>
  );
}

export default ProjectEditor;
