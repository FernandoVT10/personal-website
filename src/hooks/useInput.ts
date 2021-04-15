import React, { useState } from "react";

const useInput = (
  setValue: React.Dispatch<React.SetStateAction<string>>,
  validator: (newValue: string) => string,
): [
  string,
  (newValue: string) => void
] => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnChange = (newValue: string) => {
    const validatorResult = validator ? validator(newValue) : "";

    if(validatorResult) {
      setErrorMessage(validatorResult);
    } else {
      setErrorMessage("");
    }

    setValue(newValue);
  }

  return [errorMessage, handleOnChange];
}

export default useInput;
