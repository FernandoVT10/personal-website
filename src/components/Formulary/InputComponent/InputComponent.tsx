import React from "react";

import useInput from "@/hooks/useInput";

import styles from "./InputComponent.module.scss";

type InputProps = {[key: string]: any};

export interface ComponentProps {
  id: string
  inputProps: InputProps
  value: string
  onChange: (value: string) => void
  onBlur: () => void
}

interface InputComponentProps {
  defaultValue?: string
  inputProps?: InputProps
  label: string
  name: string
  notify?: (name: string, isValid: boolean) => void
  onChange: (value: string, name: string) => void
  validator?: (value: string) => string

  Component: React.ComponentType<ComponentProps>
}

export const InputComponent = ({
  inputProps,
  defaultValue,
  label,
  name,
  validator,
  notify,
  onChange: handleOnChange,
  Component
}: InputComponentProps) => {
  const { value, errorMessage, onChange, onBlur } = useInput({
    defaultValue,
    name,
    validator,
    notify,
    isRequired: inputProps?.required || false,
    handleOnChange
  });

  const inputClass = errorMessage.length > 0 ? styles.error : "";
  const id = `${name}-input`;

  return (
    <div className={`${styles.inputContainer} ${inputClass}`}>
      <Component
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        inputProps={inputProps}
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

export default InputComponent;
