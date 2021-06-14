import React, { useState } from "react";

import styles from "./ImagesCarousel.module.scss";

const ImagesCarousel = ({ images }: { images: string[] }) => {
  const [activeImage, setActiveImage] = useState(0);

  const goToRight = () => {
    if(activeImage === images.length - 1) {
      return setActiveImage(0);
    }

    setActiveImage(activeImage + 1);
  }

  const goToLeft = () => {
    if(activeImage === 0) {
      return setActiveImage(images.length - 1);
    }

    setActiveImage(activeImage - 1);
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.imagescontainer}>
        {images.map((image, index) => {
          const left = 100 * (index - activeImage);

          return (
            <div
              className={styles.image}
              style={{ background: `url(${image})`, left: `${left}%` }}
              data-testid="image-carousel-image"
              key={index}
            ></div>
          );
        })}
      </div>

      <div className={styles.indicatorsContainer}>
        {images.map((_, index) => {
          const indicatorClass = activeImage === index ? styles.active : "";

          return (
            <span
              className={`${styles.indicator} ${indicatorClass}`}
              onClick={() => setActiveImage(index)}
              data-testid="image-carousel-indicator"
              key={index}
            ></span>
          );
        })}
      </div>

      <button
        className={`${styles.control} ${styles.left}`}
        onClick={goToLeft}
        data-testid="image-carousel-left-button"
      >
        <i className="fas fa-arrow-left" aria-hidden="true"></i>
      </button>

      <button
        className={`${styles.control} ${styles.right}`}
        onClick={goToRight}
        data-testid="image-carousel-right-button"
      >
        <i className="fas fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default ImagesCarousel;
