import React, { useState } from "react";

import { useRouter } from "next/router";

import { gql, useMutation } from "@apollo/client";

import ProjectEditor, { SubmitFunctionData } from "@/components/ProjectEditor";

import withUser from "@/hocs/withUser";

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

const CreateProject = () => {
  const [createProject, createProjectResult] = useMutation<ICreateProjectResult>(CREATE_PROJECT);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const onSubmit = async (projectData: SubmitFunctionData) => {
    if(!projectData.newImages.length) {
      return setErrorMessage("You need to add at least one image");
    }

    setErrorMessage("");

    try {
      const { title, content, description, technologies, newImages } = projectData;

      const result = await createProject({
        variables: {
          project: {
            title,
            content,
            description,
            technologies,
            images: newImages
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
    project: null,
    onSubmit,
    loading: createProjectResult.loading,
    error: errorMessage
  }

  return (
    <div className={styles.projectEditorContainer}>
      <ProjectEditor {...projectEditorProps}/>
    </div>
  );
}

export default withUser(CreateProject, true, "/dashboard/login");
