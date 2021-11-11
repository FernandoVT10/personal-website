import InputComponent, { ComponentProps } from "./InputComponent";

import styles from "./InputComponent/InputComponent.module.scss";

const Component = ({ id, inputProps, value, onChange, onBlur }: ComponentProps) => {
  return (
    <textarea
      id={id}
      className={styles.textarea}
      value={value}
      onChange={({ target: { value } }) => onChange(value)}
      onBlur={onBlur}

      {...inputProps}
    ></textarea>
  );
}

interface TextAreaProps {
  defaultValue?: string
  textareaProps?: {[key: string]: any}
  label: string
  name: string
  notify: (name: string, isValid: boolean) => void
  onChange: (value: string, name: string) => void
  validator?: (value: string) => string
}

const TextArea = (props: TextAreaProps) => {
  return (
    <InputComponent Component={Component} inputProps={props.textareaProps} {...props} />
  );
};

export default TextArea;
