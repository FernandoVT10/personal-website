import React, { useRef } from "react";

import styles from "./ImageList.module.scss";

type IPreviewImage = {
  fileId: number
  imageURL: string
}

export type INewImage = {
  fileId: number
  file: File[]
}

interface IImageListProps {
  setImagesToDelete: React.Dispatch<React.SetStateAction<string[]>>
  previewImages: IPreviewImage[]
  setPreviewImages: React.Dispatch<React.SetStateAction<IPreviewImage[]>>
  setNewImages: React.Dispatch<React.SetStateAction<INewImage[]>>
  currentPreviewImage: number
  setCurrentPreviewImage: React.Dispatch<number>
}

const ImageList = ({
  setImagesToDelete,
  previewImages,
  setPreviewImages,
  setNewImages,
  currentPreviewImage,
  setCurrentPreviewImage,
}: IImageListProps) => {
  const imagesContainer = useRef<HTMLDivElement>(undefined);

  const handleRightArrowButton = () => {
    const { current: div } = imagesContainer;

    div.scroll(div.scrollLeft + div.clientWidth, 0);

    if(div.scrollLeft + div.clientWidth > div.scrollWidth) {
      div.scroll(div.scrollWidth - div.clientWidth, 0);
    }
  }

  const handleLeftArrowButton = () => {
    const { current: div } = imagesContainer;

    div.scroll(div.scrollLeft - div.clientWidth, 0);

    if(div.scrollLeft - div.clientWidth < 0) {
      div.scroll(0, 0);
    }
  }

  const deleteImage = (previewImage: IPreviewImage, index: number) => {
    setPreviewImages(previewImages.filter(
      (_, previewImageIndex) => previewImageIndex !== index
    ));

    // if the last image is selected we need to substract 1 to the currentPreviewImage
    if(currentPreviewImage === previewImages.length - 1) {
      setCurrentPreviewImage(index - 1);
    }

    if(previewImage.fileId !== null) {
      // if the fileId exists we need to delete the corresponding file from the newImages array
      setNewImages(prevNewImages => prevNewImages.filter(
        newImage => newImage.fileId !== previewImage.fileId
      ));
    } else {
      // if it doesn't exist it means this is a image that we need to delete in the server
      setImagesToDelete(prevImages => [...prevImages, previewImage.imageURL]);
    }
  }


  return (
    <div className={styles.imageList}>
      <button className={styles.controlButton} onClick={handleLeftArrowButton}>
        <i className="fas fa-arrow-left" aria-hidden="true"></i>
      </button>

      <div className={styles.imagesContainer} ref={imagesContainer}>
        {previewImages.map((previewImage, index) => {
          const imagesContainerClass = index === currentPreviewImage ? styles.active : "";

          return (
            <div className={`${styles.imageContainer} ${imagesContainerClass}`} key={index}>
              <img
                src={previewImage.imageURL}
                alt="Image"
                className={styles.image}
              />

              <div className={styles.hoverContent}>
                <button
                  className={styles.actionButton}
                  onClick={() => setCurrentPreviewImage(index)}
                  title="See preview"
                >
                  <i className="fas fa-expand" aria-hidden="true"></i>
                </button>

                <button
                  className={styles.actionButton}
                  onClick={() => deleteImage(previewImage, index)}
                  title="Delete Image"
                >
                  <i className="fas fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          );
        })}
        <div className={styles.addImageButtonContainer}>
          <label
            className={styles.addImageButton}
            htmlFor="carousel-input-file"
          >
            <i className="fas fa-plus" aria-hidden="true"></i>
          </label>
        </div>
      </div>

      <button className={styles.controlButton} onClick={handleRightArrowButton}>
        <i className="fas fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default ImageList;
