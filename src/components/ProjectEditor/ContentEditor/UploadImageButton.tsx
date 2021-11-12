import React from "react";

import { gql, useMutation } from "@apollo/client";

import Loader from "@/components/Loader";

import { imageValidator } from "@/utils/validators";

import styles from "./ContentEditor.module.scss";

export const UPLOAD_IMAGE = gql`
  mutation UploadImage($image: Upload!) {
    uploadImage(image: $image)
  }
`;

interface IMutationResult {
  uploadImage: string
}

interface UploadImageButton {
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  setImageOnTheTextArea: (imageName: string, imageURL: string) => void
}

const UploadImageButton = ({ setErrorMessage, setImageOnTheTextArea }) => {
  const [uploadImage, uploadImageResult] = useMutation<IMutationResult>(UPLOAD_IMAGE);

  const handleInputFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if(!file) return;

    if(!imageValidator(file.type)) return setErrorMessage("All files must be images");

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

  return (
    <>
      <input
        type="file"
        id="content-editor-input-file"
        className={styles.inputFile}
        onChange={handleInputFile}
        accept="image/*"
      />

      { uploadImageResult.loading && 
      <div className={styles.loaderContainer}>
        <Loader/>
        <p className={styles.text}>Uploading Image</p>
      </div>
      }

      <label htmlFor="content-editor-input-file" className={`${styles.action} ${styles.uploadImageAction}`}>
        <i className="fas fa-image" aria-hidden="true"></i>
        Upload Image
      </label>
    </>
  );
}

export default UploadImageButton;
