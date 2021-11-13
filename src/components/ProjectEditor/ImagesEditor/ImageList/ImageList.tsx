import React, { useRef } from "react";

import styles from "./ImageList.module.scss";

type IImage = {
  id: string
  imageURL: string
}

interface IImageListProps {
  images: IImage[]
  deleteImage: (imageId: string) => void
  currentPreviewImage: number
  setCurrentPreviewImage: React.Dispatch<number>
}

const ImageList = ({
  images,
  deleteImage,
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

  return (
    <div className={styles.imageList}>
      <button
        className={styles.controlButton}
        onClick={handleLeftArrowButton}
      >
        <i className="fas fa-arrow-left" aria-hidden="true"></i>
      </button>

      <div
        className={styles.imagesContainer}
        ref={imagesContainer}
      >
        {images.map((image, index) => {
          const imagesContainerClass = index === currentPreviewImage ? styles.active : "";

          return (
            <div className={`${styles.imageContainer} ${imagesContainerClass}`} key={index}>
              <img
                src={image.imageURL}
                alt="Image List Image"
                className={styles.image}
              />

              <div className={styles.hoverContent}>
                <button
                  className={styles.actionButton}
                  onClick={() => setCurrentPreviewImage(index)}
                  title="See preview"
                  data-testid="image-list-preview-button"
                >
                  <i className="fas fa-expand" aria-hidden="true"></i>
                </button>

                <button
                  className={styles.actionButton}
                  onClick={() => deleteImage(image.id)}
                  title="Delete Image"
                  data-testid="image-list-delete-button"
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
            htmlFor="images-editor-input-file"
          >
            <img
              className={styles.addImagesIcon}
              src="/img/icons/add-images.svg"
              alt="Add Images Icon"
            />
          </label>
        </div>
      </div>

      <button
        className={styles.controlButton}
        onClick={handleRightArrowButton}
      >
        <i className="fas fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default ImageList;
