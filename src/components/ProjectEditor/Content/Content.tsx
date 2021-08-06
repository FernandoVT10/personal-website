import React, { useRef, useState } from "react";
import { gql, useMutation } from "@apollo/client";

import MarkDown from "@/components/MarkDown";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";

import { imageValidator } from "@/utils/validators";

import styles from "./Content.module.scss";

export const UPLOAD_IMAGE = gql`
  mutation UploadImage($image: Upload!) {
    uploadImage(image: $image)
  }
`;

interface IContentProps {
  content: string
  setContent: React.Dispatch<string>
}

interface IMutationResult {
  uploadImage: string
}

const Content = ({ content, setContent }: IContentProps) => {
  const [uploadImage, uploadImageResult] = useMutation<IMutationResult>(UPLOAD_IMAGE);

  const [isActive, setIsActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const editor = useRef<HTMLTextAreaElement>(undefined);

  const handleTextAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setErrorMessage("");
  }

  const handleTextAreaOnBlur = () => {
    if(!content) {
      setErrorMessage("The content is required");
    }
  }

  const setImageOnTheTextArea = (imageName: string, imageURL: string) => {
    const start = editor.current.selectionStart;
    const end = editor.current.selectionEnd;

    editor.current.setRangeText(`\n![${imageName}](${imageURL})`, start, end, "select");

    const event = new Event("input", { bubbles: true });
    editor.current.dispatchEvent(event);
  }

  const handleInputFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    if(!file) return;

    if(!imageValidator(file.type)) return setErrorMessage("The file must be a .jpg, .png or .jpeg image.");

    try {
      const result = await uploadImage({
        variables: {
          image: file
        }
      }); 

      const imageName = file.name;

      setImageOnTheTextArea(imageName, result.data.uploadImage);
    } catch(err) {
      setErrorMessage(err.message);
    }
  }

  const contentClass = errorMessage.length > 0 ? styles.error : "";

  return (
    <div className={`${styles.content} ${contentClass}`} data-testid="content-container">
      <Modal isActive={isActive} setIsActive={setIsActive}>
        <div className={styles.markDownContainer}>
          <MarkDown content={content}/>
        </div>
      </Modal>

      <input
        type="file"
        id="content-editor-input-file"
        className={styles.inputFile}
        onChange={handleInputFile}
        accept="image/*"
        data-testid="content-editor-input-file"
      />

      { uploadImageResult.loading && 
      <div className={styles.loaderContainer}>
        <Loader/>
        <p className={styles.text}>Uploading Image</p>
      </div>
      }

      <div className={styles.actions}>
        <button className={styles.action} onClick={() => setIsActive(true)}>
          <i className="fas fa-eye" aria-hidden="true"></i>
          See the preview
        </button>

        <label htmlFor="content-editor-input-file" className={`${styles.action} ${styles.uploadImageAction}`}>
          <i className="fas fa-image" aria-hidden="true"></i>
          Upload Image
        </label>

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
