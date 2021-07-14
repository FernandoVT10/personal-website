import React, { useState } from "react";

import ErrorPage from "@/components/ErrorPage";
import ProjectEditor, { IProjectEditorProps } from "@/components/ProjectEditor";

import { INewImage } from "@/components/ProjectEditor/Carousel/ImageList";

import styles from "./Styles.module.scss";

interface IEditProjectProps {
  project: IProjectEditorProps["project"]
  error: boolean
}

const EditProject = ({ project, error }: IEditProjectProps) => {
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<INewImage[]>([]);

  if(error) {
    return <ErrorPage statusCode="404" error="Project not found" />;
  }

  const projectEditorProps = {
    project,
    setImagesToDelete,
    setNewImages
  }

  console.log("newImages", newImages);
  console.log("imagesToDelete", imagesToDelete);

  return (
    <div className={styles.projectEditorContainer}>
      <ProjectEditor {...projectEditorProps}/>
    </div>
  );
}

export default EditProject;
