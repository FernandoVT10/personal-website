import React, { useEffect, useRef, useState } from "react";

import MarkDown from "@/components/MarkDown";
import Modal from "@/components/Modal";
import { TextArea } from "@/components/Formulary";

import hljs from "highlight.js";

import styles from "./Content.module.scss";

interface IContentProps {
  content: string
  setContent: React.Dispatch<string>
}

const Content = ({ content, setContent }: IContentProps) => {
  const editor = useRef<HTMLTextAreaElement>(undefined);
  const [isActive, setIsActive] = useState(false);

  // const setAnImage = () => {
  //   const start = editor.current.selectionStart;
  //   const end = editor.current.selectionEnd;

  //   editor.current.setRangeText("\n![Image](https://resi.ze-robot.com/dl/4k/4k-desktop-wallpaper.-1920%C3%971200.jpg)", start, end, "select");

  //   const event = new Event("input", { bubbles: true });
  //   editor.current.dispatchEvent(event);
  // }

  return (
    <div className={styles.content}>
      <Modal isActive={isActive} setIsActive={setIsActive}>
        <div className={styles.markDownContainer}>
          <MarkDown content={content}/>
        </div>
      </Modal>

      <div className={styles.contentEditor}>
        <textarea 
          className={styles.editor}
          placeholder="Content"
          value={content}
          onChange={({ target: { value } }) => setContent(value)}
          ref={editor}
        ></textarea>

        <button className={styles.previewButton} onClick={() => setIsActive(true)}>
          <i className="fas fa-eye" aria-hidden="true"></i>
          See the preview
        </button>
      </div>
    </div>
  );
}

export default Content;
