import React from "react";
import Loader from "../Loader";

import styles from "./FullScreenLoader.module.scss";

const FullScreenLoader = ({ message }: { message: string }) => {
  return (
    <div className={styles.container}>
      <Loader/>
      <p className={styles.message}>{ message }</p>
    </div>
  );
}

export default FullScreenLoader;
