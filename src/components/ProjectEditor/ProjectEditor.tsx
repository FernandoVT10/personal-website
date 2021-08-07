import React from "react";

import { Input, TextArea } from "@/components/Formulary";

import { inputValidators } from "@/utils/validators";

import Carousel from "./Carousel";
import { INewImage } from "./Carousel/ImageList";
import Content from "./Content";
import Technologies from "./Technologies";

import Loader from "../Loader";

import styles from "./ProjectEditor.module.scss";

export interface IProjectEditorProps {
  images: string[]
  setImagesToDelete?: React.Dispatch<string[]>
  setNewImages: React.Dispatch<INewImage[]>
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
  images,
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
  const handleOnClick = () => {
    if(!title.length) return document.getElementById("title-input").focus();;
    if(!description.length) return document.getElementById("description-textarea").focus();
    if(!content.length) return document.getElementById("content-textarea").focus();

    onSave();
  }

  return (
    <div className={styles.projectEditor}>
      <Carousel
        images={images}
        setImagesToDelete={setImagesToDelete}
        setNewImages={setNewImages}
      />

      <Input
        label="Title"
        prefix="title"
        value={title}
        setValue={setTitle}
        maxLength={100}
        validator={inputValidators.requiredInput("title")}
      />

      <TextArea
        label="Description"
        prefix="description"
        value={description}
        setValue={setDescription}
        maxLength={250}
        validator={inputValidators.requiredInput("description")}
      />

      <Content content={content} setContent={setContent} />

      <Technologies selectedTechnologies={selectedTechnologies} setSelectedTechnologies={setSelectedTechnologies} />

      { error &&
      <p className={styles.errorMessage}>
        <i className="fas fa-times-circle" aria-hidden="true"></i>
        { error }
      </p>
      }

      { loading ?
        <div className={styles.loaderContainer}>
          <Loader/>
        </div>
        :

        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleOnClick}>Save Project</button>

          <button className={`${styles.button} ${styles.secondary}`} onClick={goBack}>
            Go Back
          </button>
        </div>

      }
    </div>
  );
}

export default ProjectEditor;
