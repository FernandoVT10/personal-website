import React, { useState } from "react";

import ErrorPage from "@/components/ErrorPage";
import ProjectEditor, { IProjectEditorProps } from "@/components/ProjectEditor";

import { INewImage } from "@/components/ProjectEditor/Carousel/ImageList";

import styles from "./Styles.module.scss";

interface IEditProjectProps {
  project: {
    title: string
    images: string[]
    description: string
    content: string
  }
  error: boolean
}

const EditProject = ({ project, error }: IEditProjectProps) => {
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<INewImage[]>([]);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [content, setContent] = useState(project.content);

  if(error) {
    return <ErrorPage statusCode="404" error="Project not found" />;
  }

  const projectEditorProps = {
    images: project.images,
    project,
    setImagesToDelete,
    setNewImages,
    title, setTitle,
    description, setDescription,
    content, setContent
  }


  return (
    <div className={styles.projectEditorContainer}>
      <ProjectEditor {...projectEditorProps}/>
    </div>
  );
}

export default EditProject;
