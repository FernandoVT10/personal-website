import React, { useState } from "react";

import ImageList, { INewImage } from "./ImageList";

import Loader from "@/components/Loader";

import getImageURLs from "@/utils/getImageURLs";

import { imageValidator } from "@/utils/validators";

import styles from "./Carousel.module.scss";

interface ICarouselProps {
  images: string[]
  setImagesToDelete: React.Dispatch<React.SetStateAction<string[]>>
  setNewImages: React.Dispatch<React.SetStateAction<INewImage[]>>
}

let currentFileId = 0;

const Carousel = ({ setImagesToDelete, images, setNewImages }: ICarouselProps) => {
  const [previewImages, setPreviewImages] = useState(
    // we'll need the fileId to be able to remove the image file from the newImages array
    images.map(image => ({
      fileId: null,
      imageURL: image
    }))
  );
  const [currentPreviewImage, setCurrentPreviewImage] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const addImages = async (files: FileList) => {
    const fileArray = [];

    for(let i = 0; i < files.length; i++) {
      const file = files.item(i);

      if(!imageValidator(file.type)) {
        return setErrorMessage("All the files must be an image .png, .jpeg or .jpg");
      }

      fileArray.push(file);
    }

    setLoadingImages(true);

    const imageURLs = await getImageURLs(fileArray);

    // here we set the current preview image in the last image
    setCurrentPreviewImage(previewImages.length + imageURLs.length - 1);

    const newPreviewImages = [];
    const newImages = []

    for(let i = 0; i < fileArray.length; i++) {
      // here we need to have the same id in the previewImages and newImages array
      newPreviewImages.push({
        fileId: currentFileId,
        imageURL: imageURLs[i]
      });

      newImages.push({
        fileId: currentFileId,
        file: fileArray[i]
      });

      currentFileId++;
    }

    setPreviewImages(previewImages.concat(newPreviewImages));
    setNewImages(prevNewImages => prevNewImages.concat(newImages));

    setLoadingImages(false);
    setErrorMessage("");
  }

  const handleOnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addImages(e.dataTransfer.files);
  }

  return (
    <div
      className={styles.carousel}
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

      { loadingImages && 
      <div className={styles.loaderContainer}>
        <p className={styles.message}>Loading the images.</p>
        <Loader/>
      </div>
      }

      <input
        type="file"
        id="carousel-input-file"
        onChange={e => addImages(e.target.files)}
        className={styles.inputFile}
        multiple
      />

      <div className={styles.previewContainer}>
        { previewImages.length && previewImages[currentPreviewImage] ?
        <img
          src={previewImages[currentPreviewImage].imageURL}
          className={styles.previewImage}
          alt="Preview Image"
        />
        :
        <label
          className={styles.addImageButton}
          htmlFor="carousel-input-file"
        >
          <i className="fas fa-image" aria-hidden="true"></i>
        </label>
        }
      </div>
      
      <ImageList
        setImagesToDelete={setImagesToDelete}
        previewImages={previewImages}
        setPreviewImages={setPreviewImages}
        setNewImages={setNewImages}
        currentPreviewImage={currentPreviewImage}
        setCurrentPreviewImage={setCurrentPreviewImage}
      />

      { errorMessage && 
        <p className={styles.errorMessage}>{ errorMessage }</p>
      }
    </div>
  );
}

export default Carousel;
