import InputComponent, { ComponentProps } from "./InputComponent";

import styles from "./InputComponent/InputComponent.module.scss";

const Component = ({ id, inputProps, value, onChange, onBlur }: ComponentProps) => {
  return (
    <input
      id={id}
      className={styles.input}
      value={value}
      onChange={({ target: { value } }) => onChange(value)}
      onBlur={onBlur}

      {...inputProps}
    />
  );
}

interface InputProps {
  defaultValue?: string
  inputProps?: {[key: string]: any}
  label: string
  name: string
  notify: (name: string, isValid: boolean) => void
  onChange: (value: string, name: string) => void
  validator?: (value: string) => string
}

const Input = (props: InputProps) => <InputComponent Component={Component} {...props} />;

export default Input;
