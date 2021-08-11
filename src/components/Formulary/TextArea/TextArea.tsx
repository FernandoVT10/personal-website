import React from "react";

import useInput from "@/hooks/useInput";

import styles from "./TextArea.module.scss";

interface TextAreaProps {
  prefix: string,
  label: string,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  validator?: (newValue: string) => string
  maxLength?: number
}

const TextArea = ({ prefix, label, value, setValue, validator, maxLength }: TextAreaProps) => {
  const [errorMessage, { onChange, onBlur }] = useInput(setValue, validator);

  const textareaClass = errorMessage.length > 0 ? styles.error : "";

  return (
    <div className={`${styles.textareaContainer} ${textareaClass}`}>
      <textarea
        id={`${prefix}-textarea`}
        className={styles.textarea}
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
        maxLength={maxLength ?? 10000}
        onBlur={({ target: { value } }) => onBlur(value)}
        data-testid="textarea-component"
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
