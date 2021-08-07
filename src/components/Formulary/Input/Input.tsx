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
  maxLength?: number
}

const Input = ({ prefix, label, value, setValue, validator, type, maxLength }: InputProps) => {
  const [errorMessage, { onChange, onBlur }] = useInput(setValue, validator);

  const inputClass = errorMessage.length > 0 ? styles.error : "";

  return (
    <div className={`${styles.inputContainer} ${inputClass}`}>
      <input
        type={type ?? "text"}
        id={`${prefix}-input`}
        className={styles.input}
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
        maxLength={maxLength ?? 10000}
        onBlur={({ target: { value } }) => onBlur(value)}
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
