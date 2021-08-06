import React, { useState } from "react";

import { useRouter } from "next/router";

import { gql, useMutation } from "@apollo/client";

import ProjectEditor from "@/components/ProjectEditor";
import { INewImage } from "@/components/ProjectEditor/Carousel/ImageList";

import styles from "./Styles.module.scss";

const CREATE_PROJECT = gql`
  mutation CreateProject($project: CreateProjectInput!) {
    createProject(project: $project) {
      _id
    }
  }
`;

interface ICreateProjectResult {
  createProject: {
    _id: string
  }
}

const Create = () => {
  const [createProject, createProjectResult] = useMutation<ICreateProjectResult>(CREATE_PROJECT);

  const [newImages, setNewImages] = useState<INewImage[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  const router = useRouter();

  const goBack = () => router.push("/dashboard/");

  const onSave = async () => {
    try {
      const result = await createProject({
        variables: {
          project: {
            title,
            // here we're getting the files from the newImages array
            images: newImages.map(newImage => newImage.file),
            description,
            content,
            technologies: selectedTechnologies
          }
        }
      });

      const { _id: projectId } = result.data.createProject;

      router.push(`/projects/${projectId}`);
    } catch(err) {
      console.log(err.message);
    }
  }

  const projectEditorProps = {
    images: [],
    setNewImages,
    title, setTitle,
    description, setDescription,
    content, setContent,
    selectedTechnologies, setSelectedTechnologies,
    goBack, onSave,
    loading: createProjectResult.loading,
    error: createProjectResult.error ? createProjectResult.error.message : ""
  }

  return (
    <div className={styles.projectEditorContainer}>
      <ProjectEditor {...projectEditorProps}/>
    </div>
  );
}

export default Create;
