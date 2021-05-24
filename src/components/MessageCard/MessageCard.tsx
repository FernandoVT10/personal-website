import React from "react";

import styles from "./MessageCard.module.scss";

const MessageCard = ({ type, message }: { type: string, message: string }) => {
  return (
    <div className={`${styles.messageCard} ${styles[type]}`}>
      <p className={styles.message}>{ message }</p>
    </div>
  );
}

export default MessageCard;
