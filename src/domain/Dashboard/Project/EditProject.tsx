import React, { useState } from "react";

import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import ErrorPage from "@/components/ErrorPage";
import ProjectEditor, {IProjectEditorProps} from "@/components/ProjectEditor";

import withUser from "@/hocs/withUser";

import styles from "./Styles.module.scss";

export const UPDATE_PROJECT = gql`
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
    images: IProjectEditorProps["imagesObjects"]
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
  const [newImages, setNewImages] = useState<any[]>([]);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [content, setContent] = useState(project.content);
  const [selectedTechnologies, setSelectedTechnologies] = useState(
    project.technologies.map(technology => technology.name)
  );

  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  if(error) {
    return <ErrorPage statusCode="404" error="Project not found" />;
  }

  const goBack = () => router.push("/dashboard/");

  const onSave = async () => {
    // here i get the images that aren't deleted
    // const numberOfImagesNotDeleted = project.images.reduce((acc, image) => {
    //   // if the image is included on te imagesToDelete array it means that the image is already deleted
    //   if(imagesToDelete.includes(image)) acc--;
    //   return acc;
    // }, project.images.length);

    // if(!newImages.length && numberOfImagesNotDeleted < 1) {
    //   return setErrorMessage("You need to add at least one image to the carousel");
    // }

    setErrorMessage("");

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
      setErrorMessage(err.message);
    }
  }

  const projectEditorProps = {
    project,
    imagesObjects: project.images,
    setImagesToDelete,
    setNewImages,
    title, setTitle,
    description, setDescription,
    content, setContent,
    selectedTechnologies, setSelectedTechnologies,
    goBack, onSave,
    loading: updateProjectResult.loading,
    error: errorMessage
  }


  return (
    <div className={styles.projectEditorContainer}>
      <ProjectEditor {...projectEditorProps}/>
    </div>
  );
}

export default withUser(EditProject, true, "/dashboard/login");
