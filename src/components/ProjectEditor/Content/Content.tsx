import React, { useState } from "react";

import MarkDown from "@/components/MarkDown";
import Modal from "@/components/Modal";
import { TextArea } from "@/components/Formulary";

import styles from "./Content.module.scss";

interface IContentProps {
  content: string
  setContent: React.Dispatch<string>
}

const Content = ({ content, setContent }: IContentProps) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={styles.content}>
      <Modal isActive={isActive} setIsActive={setIsActive}>
        <MarkDown content={content}/>
      </Modal>

      <div className={styles.contentEditor}>
        <TextArea
          label="Content"
          prefix="content"
          value={content}
          setValue={setContent}
        />

        <button className={styles.previewButton} onClick={() => setIsActive(true)}>
          <i className="fas fa-eye" aria-hidden="true"></i>
          See the preview
        </button>
      </div>
    </div>
  );
}

export default Content;
