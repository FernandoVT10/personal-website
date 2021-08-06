import React, { useState } from "react";

const useInput = (
  setValue: React.Dispatch<React.SetStateAction<string>>,
  validator: (newValue: string) => string,
): [
  string,
  {
    onChange: (newValue: string) => void,
    onBlur: (value: string) => void
  }
  
] => {
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = (newValue: string) => {
    const validatorMessage = validator ? validator(newValue) : "";

    if(!validatorMessage) {
      setErrorMessage("");
    }

    setValue(newValue);
  }

  const onBlur = (value: string) => {
    const validatorMessage = validator ? validator(value) : "";

    if(validatorMessage) {
      setErrorMessage(validatorMessage);
    } else {
      setErrorMessage("");
    }
  }

  return [errorMessage, { onChange, onBlur }];
}

export default useInput;
