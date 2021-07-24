import React, { useState } from "react";

import ErrorPage from "@/components/ErrorPage";
import ProjectEditor, { IProjectEditorProps } from "@/components/ProjectEditor";

import { INewImage } from "@/components/ProjectEditor/Carousel/ImageList";

import styles from "./Styles.module.scss";
import withUser from "@/hocs/withUser";

interface IEditProjectProps {
  project: {
    title: string
    images: string[]
    description: string
    content: string
    technologies: {
      name: string
    }[]
  }
  error: boolean
}

const EditProject = ({ project, error }: IEditProjectProps) => {
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<INewImage[]>([]);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [content, setContent] = useState(project.content);
  const [selectedTechnologies, setSelectedTechnologies] = useState(
    project.technologies.map(technology => technology.name)
  );

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
    content, setContent,
    selectedTechnologies, setSelectedTechnologies
  }


  return (
    <div className={styles.projectEditorContainer}>
      <ProjectEditor {...projectEditorProps}/>
    </div>
  );
}

export default withUser(EditProject, true, "/dashboard/login");
