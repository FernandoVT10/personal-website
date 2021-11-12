import React, { useRef, useState } from "react";

import MarkDown from "@/components/MarkDown";
import Modal from "@/components/Modal";

import UploadImageButton from "./UploadImageButton";

import styles from "./Content.module.scss";

interface IContentProps {
  onChange: (value: string, name: string) => void
  defaultValue: string
  notify: (name: string, isValid: boolean) => void
}

const Content = ({ onChange, defaultValue, notify}: IContentProps) => {
  const [content, setContent] = useState(defaultValue);
  const [isActive, setIsActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const editor = useRef<HTMLTextAreaElement>(undefined);

  const handleTextAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setContent(value);
    setErrorMessage("");

    onChange(value, "content");
    notify("content", content.length > 0);
  }

  const handleTextAreaOnBlur = () => {
    if(!content.length) setErrorMessage("The content is required");
  }

  const setImageOnTheTextArea = (imageName: string, imageURL: string) => {
    const end = editor.current.selectionEnd;
    editor.current.setRangeText(`\n![${imageName}](${imageURL})`, end, end, "select");

    const event = new Event("input", { bubbles: true });
    editor.current.dispatchEvent(event);
  }

  const contentClass = errorMessage.length > 0 ? styles.error : "";

  return (
    <div className={`${styles.content} ${contentClass}`} data-testid="content-container">
      <Modal isActive={isActive} setIsActive={setIsActive}>
        <div className={styles.markDownContainer}>
          <MarkDown content={content}/>
        </div>
      </Modal>


      <div className={styles.actions}>
        <button className={styles.action} onClick={() => setIsActive(true)}>
          <i className="fas fa-eye" aria-hidden="true"></i>
          See the preview
        </button>

        <UploadImageButton setErrorMessage={setErrorMessage} setImageOnTheTextArea={setImageOnTheTextArea}/>
      </div>

      <div className={styles.contentEditor}>
        <textarea 
          className={styles.editor}
          id="content-textarea"
          placeholder="Content"
          value={content}
          onChange={handleTextAreaOnChange}
          onBlur={handleTextAreaOnBlur}
          data-testid="content-editor-textarea"
          ref={editor}
        ></textarea>
      </div>

      { errorMessage.length > 0 &&
      <p className={styles.errorMessage}>
        <i className="fas fa-times-circle" aria-hidden="true"></i>
        { errorMessage }
      </p>
      }
    </div>
  );
}

export default Content;
