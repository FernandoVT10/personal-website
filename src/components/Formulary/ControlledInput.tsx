import React, { useState } from "react";

import styles from "./InputComponent/InputComponent.module.scss";

interface ControlledInputProps {
  defaultValue?: string
  inputProps?: {[key: string]: any}
  label: string
  name: string
  onChange: (value: string, name: string) => void
  errorMessage: string
  setErrorMessage: React.Dispatch<string>
}

export const ControlledInput = ({
  inputProps,
  label,
  name,
  onChange: handleOnChange,
  errorMessage,
  setErrorMessage
}: ControlledInputProps) => {
  const [value, setValue] = useState("");

  const onChange = (value: string) => {
    handleOnChange(value, name);
    setErrorMessage("");
    setValue(value);
  }

  const onBlur = () => {
    if(inputProps?.required && value.length < 1) {
      setErrorMessage("The field is required");
    }
  }

  const inputClass = errorMessage.length > 0 ? styles.error : "";
  const id = `${name}-input`;

  return (
    <div className={`${styles.inputContainer} ${inputClass}`}>
      <input
        id={id}
        className={styles.input}
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
        onBlur={onBlur}

        {...inputProps}
      />

      <label htmlFor={id} className={styles.label}>
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

export default ControlledInput;
