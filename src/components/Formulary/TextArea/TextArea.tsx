import React from "react";

import useInput from "@/hooks/useInput";

import styles from "./TextArea.module.scss";

interface TextAreaProps {
  prefix: string,
  label: string,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  validator?: (newValue: string) => string
}

const TextArea = ({ prefix, label, value, setValue, validator }: TextAreaProps) => {
  const [errorMessage, handleOnChange] = useInput(setValue, validator);

  return (
    <div className={styles.textareaContainer}>
      <textarea
        id={`${prefix}-textarea`}
        className={styles.textarea}
        value={value}
        onChange={({ target: { value } }) => handleOnChange(value)}
        required
      ></textarea>

      <label htmlFor={`${prefix}-textarea`} className={styles.label}>
        { label }
      </label>

      { errorMessage.length > 0 &&
      <p className={styles.errorMessage}>
        <i className="fas fa-times-circle"></i>
        { errorMessage }
      </p>
      }
    </div>
  );
}

export default TextArea;
