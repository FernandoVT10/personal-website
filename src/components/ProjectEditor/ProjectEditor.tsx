import React, { useReducer, useState } from "react";

import { Input, TextArea } from "@/components/Formulary";

import ImagesEditor, { ImagesObjects } from "./ImagesEditor";
import ContentEditor from "./ContentEditor";
import Technologies from "./Technologies";

import Loader from "../Loader";

import { reducer, initialState } from "./reducer";

import styles from "./ProjectEditor.module.scss";

export interface IProjectEditorProps {
  project: {
    title: string
    description: string
    content: string
  }

  imagesObjects: ImagesObjects
  setImagesToDelete?: React.Dispatch<string[]>
  setNewImages: React.Dispatch<any[]>
  title: string
  setTitle: React.Dispatch<string>
  description: string
  setDescription: React.Dispatch<string>
  content: string
  setContent: React.Dispatch<string>
  selectedTechnologies: string[]
  setSelectedTechnologies: React.Dispatch<string[]>
  goBack: () => void
  onSave: () => void
  loading: boolean
  error: string
}

const ProjectEditor = ({
  project,
  imagesObjects,
  setImagesToDelete,
  setNewImages,
  title,
  setTitle,
  description,
  setDescription,
  content,
  setContent,
  selectedTechnologies,
  setSelectedTechnologies,
  goBack,
  onSave,
  loading,
  error
}: IProjectEditorProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [validation, setValidation] = useState<{[key: string]: boolean}>({});

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

  const handleOnClick = () => {
    if(!title.length) return document.getElementById("title-input").focus();
    if(!description.length) return document.getElementById("description-textarea").focus();
    if(!content.length) return document.getElementById("content-textarea").focus();

    onSave();
  }

  const handleInputOnChange = (value: string, name: string) => {
    dispatch({ type: "set-input-value", payload: { value, name } });
  }

  console.log(state);

  return (
    <div className={styles.projectEditor}>
      <ImagesEditor
        imagesObjects={imagesObjects}
        dispatch={dispatch}
      />

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

      <ContentEditor
        onChange={handleInputOnChange}
        defaultValue={project.content}
        notify={notify}
      />

      <Technologies selectedTechnologies={selectedTechnologies} setSelectedTechnologies={setSelectedTechnologies} />
    </div>
  );

  // return (
  //   <div className={styles.projectEditor}>
  //     <Carousel
  //       images={images}
  //     />

  //     <Input
  //       label="Title"
  //       prefix="title"
  //       value={title}
  //       setValue={setTitle}
  //       maxLength={100}
  //       validator={inputValidators.requiredInput("title")}
  //     />

  //     <TextArea
  //       label="Description"
  //       prefix="description"
  //       value={description}
  //       setValue={setDescription}
  //       maxLength={250}
  //       validator={inputValidators.requiredInput("description")}
  //     />

  //     <Content content={content} setContent={setContent} />

  //     <Technologies selectedTechnologies={selectedTechnologies} setSelectedTechnologies={setSelectedTechnologies} />

  //     { error &&
  //     <p className={styles.errorMessage}>
  //       <i className="fas fa-times-circle" aria-hidden="true"></i>
  //       { error }
  //     </p>
  //     }

  //     { loading ?
  //       <div className={styles.loaderContainer}>
  //         <Loader/>
  //       </div>
  //       :

  //       <div className={styles.buttons}>
  //         <button className={styles.button} onClick={handleOnClick}>Save Project</button>

  //         <button className={`${styles.button} ${styles.secondary}`} onClick={goBack}>
  //           Go Back
  //         </button>
  //       </div>

  //     }
  //   </div>
  // );
}

export default ProjectEditor;
