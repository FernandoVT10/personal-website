import React, { useState } from "react";

import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import ErrorPage from "@/components/ErrorPage";
import ProjectEditor from "@/components/ProjectEditor";

import { INewImage } from "@/components/ProjectEditor/Carousel/ImageList";

import withUser from "@/hocs/withUser";

import styles from "./Styles.module.scss";

const UPDATE_PROJECT = gql`
  mutation UpdateProject($projectId: ID!, $project: UpdateProjectInput!) {
    updateProject(projectId: $projectId, project: $project) {
      _id
    }
  }
`;

interface IEditProjectProps {
  project: {
    _id: string
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

interface IUpdateProjectResult {
  updateProject: {
    _id: string
  }
}

const EditProject = ({ project, error }: IEditProjectProps) => {
  const [updateProject, updateProjectResult] = useMutation<IUpdateProjectResult>(UPDATE_PROJECT);

  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<INewImage[]>([]);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [content, setContent] = useState(project.content);
  const [selectedTechnologies, setSelectedTechnologies] = useState(
    project.technologies.map(technology => technology.name)
  );

  const router = useRouter();

  if(error) {
    return <ErrorPage statusCode="404" error="Project not found" />;
  }

  const goBack = () => router.push("/dashboard/");

  const onSave = async () => {
    try {
      const result = await updateProject({
        variables: {
          projectId: project._id,
          project: {
            title,
            imagesToDelete,
            // here we're getting the files from the newImages array
            newImages: newImages.map(newImage => newImage.file),
            description,
            content,
            technologies: selectedTechnologies
          }
        }
      });

      const { _id: projectId } = result.data.updateProject;

      router.push(`/projects/${projectId}`);
    } catch(err) {
      console.log(err.message);
    }
  }

  const projectEditorProps = {
    images: project.images,
    project,
    setImagesToDelete,
    setNewImages,
    title, setTitle,
    description, setDescription,
    content, setContent,
    selectedTechnologies, setSelectedTechnologies,
    goBack, onSave,
    loading: updateProjectResult.loading,
    error: updateProjectResult.error ? updateProjectResult.error.message : ""
  }


  return (
    <div className={styles.projectEditorContainer}>
      <ProjectEditor {...projectEditorProps}/>
    </div>
  );
}

export default withUser(EditProject, true, "/dashboard/login");
