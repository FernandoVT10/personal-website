import { useEffect, useState } from "react";

interface IUseInput {
  defaultValue: string
  name: string
  validator: (value: string) => string
  notify?: (name: string, isValid: boolean) => void
  isRequired: boolean
  handleOnChange: (value: string, name: string) => void
}

const useInput = ({ defaultValue, name, validator, notify, isRequired, handleOnChange }: IUseInput) => {
  const [value, setValue] = useState(defaultValue || "");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if(notify) notify(name, isValueValid(defaultValue || ""));
  }, []);

  const isValueValid = (value: string): boolean => {
    if(validator) {
      // if the validator returns null it means that the value is valid
      const validatorResult = validator(value);
      if(validatorResult) return false;
    }

    if(isRequired) return value.length > 0;
    return true;
  }

  const onChange = (newValue: string) => {
    const isValid = isValueValid(newValue);
    if(notify) notify(name, isValid);

    if(isValid) setErrorMessage("");

    setValue(newValue);
    handleOnChange(newValue, name);
  }

  const onBlur = () => {
    if(!isValueValid(value)) {
      if(isRequired) {
        if(value.length < 1) return setErrorMessage(`This field is required`);
      }

      const validatorMessage = validator(value);
      setErrorMessage(validatorMessage || "");
    }
  }

  return { value, errorMessage, onChange, onBlur };
}

export default useInput;
