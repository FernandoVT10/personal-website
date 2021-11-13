import React, { useState } from "react";

import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import ErrorPage from "@/components/ErrorPage";
import ProjectEditor, { ImagesObjects, SubmitFunctionData } from "@/components/ProjectEditor";

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
    images: ImagesObjects
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

  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  if(error) {
    return <ErrorPage statusCode="404" error="Project not found" />;
  }

  const onSubmit = async (projectData: SubmitFunctionData) => {
    // here i get the images that aren't deleted
    const numberOfImagesNotDeleted = project.images.reduce((acc, image) => {
      // if the image is included on te imagesToDelete array it means that the image is already deleted
      if(projectData.imagesIdsToDelete.includes(image._id)) acc--;
      return acc;
    }, project.images.length);

    if(!projectData.newImages.length && numberOfImagesNotDeleted < 1) {
      return setErrorMessage("You need to add at least one image");
    }

    try {
      const result = await updateProject({
        variables: {
          projectId: project._id,
          project: projectData
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
    onSubmit,
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
