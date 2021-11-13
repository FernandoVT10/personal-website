import React, { Dispatch } from "react";

import ImageList from "./ImageList";

import Loader from "@/components/Loader";

import { Actions } from "../reducer";

import useImagesEditor, { ImageObject } from "./hook";

import styles from "./ImagesEditor.module.scss";

export type ImagesObjects = ImageObject[];

interface ImagesEditorProps {
  imagesObjects: ImagesObjects
  dispatch: Dispatch<Actions>
}

const ImagesEditor = ({ imagesObjects, dispatch }: ImagesEditorProps) => {
  const {
    addImages,
    currentPreviewImage, setCurrentPreviewImage,
    deleteImage,
    errorMessage,
    handleOnDrop,
    images,
    isDragging, setIsDragging,
    loading
  } = useImagesEditor({ imagesObjects, dispatch });

  return (
    <div
      className={`${styles.imagesEditor} ${errorMessage.length && styles.error}`}
      onDragEnter={() => setIsDragging(true)}
      onDrop={handleOnDrop}
      onDragOver={e => e.preventDefault()}
    >
      <div
        className={`${styles.dragMark} ${isDragging && styles.active}`}
        onDragLeave={() => setIsDragging(false)}
      >
        <p className={styles.text}>
          Drop the images to upload them.
        </p>
        <i className="fas fa-images" aria-hidden="true"></i>
      </div>

      { loading && 
      <div className={styles.loaderContainer}>
        <p className={styles.message}>Loading the images</p>
        <Loader/>
      </div>
      }

      <input
        type="file"
        id="images-editor-input-file"
        onChange={e => addImages(e.target.files)}
        className={styles.inputFile}
        accept="image/*"
        multiple
      />

      <div className={styles.previewContainer}>
        { images.length && images[currentPreviewImage] ?
        <img
          src={images[currentPreviewImage].imageURL}
          className={styles.previewImage}
          alt="Preview Image"
        />
        :
        <div className={styles.noImagesDiv}>
          <img
            src="/img/icons/images.svg"
            className={styles.imagesIcon}
            alt="Images Icon"
          />

          <p className={styles.text}>Drag and Drop some images.</p>

          <label
            className={styles.addImageButton}
            htmlFor="images-editor-input-file"
          >
            <i className="fas fa-image" aria-hidden="true"></i>
            Choose some images from your device
          </label>
        </div>
        }
      </div>
      
      { images.length > 0 &&
      <ImageList
        images={images}
        deleteImage={deleteImage}
        currentPreviewImage={currentPreviewImage}
        setCurrentPreviewImage={setCurrentPreviewImage}
      />
      }

      { errorMessage && 
        <p className={styles.errorMessage}>
          <i className={`fas fa-images ${styles.imagesIcon}`} aria-hidden="true"></i>
          { errorMessage }
        </p>
      }
    </div>
  );
}

export default ImagesEditor;
