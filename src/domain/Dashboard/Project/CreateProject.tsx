import React, { useState } from "react";

import { useRouter } from "next/router";

import { gql, useMutation } from "@apollo/client";

import ProjectEditor from "@/components/ProjectEditor";
import { INewImage } from "@/components/ProjectEditor/Carousel/ImageList";

import styles from "./Styles.module.scss";

export const CREATE_PROJECT = gql`
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

  const [images, setImages] = useState<INewImage[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const goBack = () => router.push("/dashboard/");

  const onSave = async () => {
    if(!images.length) {
      return setErrorMessage("You need to add at least one image to the carousel");
    }

    setErrorMessage("");

    try {
      const result = await createProject({
        variables: {
          project: {
            title,
            // here we're getting the files from the newImages array
            images: images.map(newImage => newImage.file),
            description,
            content,
            technologies: selectedTechnologies
          }
        }
      });

      const { _id: projectId } = result.data.createProject;

      router.push(`/projects/${projectId}`);
    } catch(err) {
      setErrorMessage(err.message);
    }
  }

  const projectEditorProps = {
    images: [],
    setNewImages: setImages,
    title, setTitle,
    description, setDescription,
    content, setContent,
    selectedTechnologies, setSelectedTechnologies,
    goBack, onSave,
    loading: createProjectResult.loading,
    error: errorMessage
  }

  return (
    <div className={styles.projectEditorContainer}>
      <ProjectEditor {...projectEditorProps}/>
    </div>
  );
}

export default Create;
