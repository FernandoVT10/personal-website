import React from "react";

import styles from "./Loader.module.scss";

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <span className={styles.circle}></span>
      <span className={styles.circle}></span>
      <span className={styles.circle}></span>
      <span className={styles.circle}></span>
    </div>
  );
}

export default Loader;
