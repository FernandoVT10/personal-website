import React from "react";

import styles from "./Loader.module.scss";

const Loader = () => {
  return (
    <div className={styles.loaderContainer} data-testid="loader-component">
      <span className={styles.circle} aria-hidden="true"></span>
      <span className={styles.circle} aria-hidden="true"></span>
      <span className={styles.circle} aria-hidden="true"></span>
      <span className={styles.circle} aria-hidden="true"></span>
    </div>
  );
}

export default Loader;
