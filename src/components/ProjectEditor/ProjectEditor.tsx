import React from "react";

import { Input, TextArea } from "@/components/Formulary";

import Carousel from "./Carousel";
import { INewImage } from "./Carousel/ImageList";

import styles from "./ProjectEditor.module.scss";

export interface IProjectEditorProps {
  images: string[]
  setImagesToDelete: React.Dispatch<string[]>
  setNewImages: React.Dispatch<INewImage[]>
  title: string
  setTitle: React.Dispatch<string>
  description: string
  setDescription: React.Dispatch<string>
}

const ProjectEditor = ({
  images,
  setImagesToDelete,
  setNewImages,
  title,
  setTitle,
  description,
  setDescription
}: IProjectEditorProps) => {
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
      />

      <TextArea
        label="Description"
        prefix="description"
        value={description}
        setValue={setDescription}
        maxLength={250}
      />
    </div>
  );
}

export default ProjectEditor;
