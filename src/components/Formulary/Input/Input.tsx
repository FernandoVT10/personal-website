import React from "react";

import useInput from "@/hooks/useInput";

import styles from "./Input.module.scss";

interface InputProps {
  prefix: string
  label: string
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  validator?: (newValue: string) => string
  type?: string
}

const Input = ({ prefix, label, value, setValue, validator, type }: InputProps) => {
  const [errorMessage, handleOnChange] = useInput(setValue, validator);

  const inputClass = errorMessage.length > 0 ? styles.error : "";

  return (
    <div className={`${styles.inputContainer} ${inputClass}`}>
      <input
        type={type ?? "text"}
        id={`${prefix}-input`}
        className={styles.input}
        value={value}
        onChange={({ target: { value } }) => handleOnChange(value)}
        required
      />

      <label htmlFor={`${prefix}-input`} className={styles.label}>
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

export default Input;
