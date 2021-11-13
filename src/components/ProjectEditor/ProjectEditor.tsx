import React, { useReducer, useState } from "react";
import { useRouter } from "next/router";

import { Input, TextArea } from "@/components/Formulary";

import ImagesEditor, { ImagesObjects } from "./ImagesEditor";
import ContentEditor from "./ContentEditor";
import TechnologiesEditor from "./TechnologiesEditor";

import Loader from "../Loader";

import { reducer, State } from "./reducer";

import styles from "./ProjectEditor.module.scss";

export type SubmitFunctionData = {
  newImages: File[]
  imagesIdsToDelete: string[]
  title: string
  description: string
  content: string
  technologies: string[]
}

interface IProjectEditorProps {
  project: {
    title: string
    images: ImagesObjects
    description: string
    content: string
    technologies: {
      name: string
    }[]
  }
  onSubmit: (data: SubmitFunctionData) => void
  loading: boolean
  error: string
}

const ProjectEditor = ({
  project,
  onSubmit,
  loading,
  error
}: IProjectEditorProps) => {
  if(!project) {
    project = {
      title: "",
      images: [],
      description: "",
      content: "",
      technologies: []
    }
  }

  const defaultTechnologies = project.technologies.map(({ name }) => name);

  const initialState: State = {
    newImages: [],
    imagesIdsToDelete: [],
    title: project?.title,
    description: project?.description,
    content: project?.content,
    technologies: defaultTechnologies
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const [validation, setValidation] = useState<{[key: string]: boolean}>({});

  const router = useRouter();

  const notify = (name: string, isValid: boolean) => {
    setValidation({ ...validation, [name]: isValid });
  }

  const validateForm = (): boolean => {
    let isValid = true;

    for(const key in validation) {
      if(!validation[key]) {
        isValid = false;
        break;
      }
    }

    return isValid;
  }

  const handleInputOnChange = (value: string, name: string) => {
    dispatch({ type: "set-input-value", payload: { value, name } });
  }


  const handleOnClick = () => {
    if(!validateForm()) return;
    onSubmit(state);
  }
  
  console.log(state);

  return (
    <div className={styles.projectEditor}>
      <ImagesEditor
        imagesObjects={project.images}
        dispatch={dispatch}
      />

      <div className={styles.inputContainer}>
        <Input
          defaultValue={project.title}
          inputProps={{
            maxLength: 100,
            required: true
          }}
          label="Title"
          name="title"
          notify={notify}
          onChange={handleInputOnChange}
        />
      </div>

      <div className={styles.inputContainer}>
        <TextArea
          defaultValue={project.description}
          label="Description"
          name="description"
          notify={notify}
          onChange={handleInputOnChange}
          textareaProps={{
            maxLength: 250,
            required: true
          }}
        />
      </div>

      <ContentEditor
        onChange={handleInputOnChange}
        defaultValue={project.content}
        notify={notify}
      />

      <TechnologiesEditor
        defaultTechnologies={defaultTechnologies}
        dispatch={dispatch}
      />

      { error.length > 0 &&
      <p className={styles.errorMessage}>
        { error }
      </p>
      }

      { loading ?
      <div className={styles.loaderContainer}>
        <Loader/>

        Loading...
      </div>
      :
      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleOnClick}>Save Project</button>

        <button
          className={`${styles.button} ${styles.secondary}`}
          onClick={() => router.push("/dashboard/")}
        >
          Cancel
        </button>
      </div>
      }
    </div>
  );
}

export default ProjectEditor;
