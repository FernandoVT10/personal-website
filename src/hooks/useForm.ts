import { useState } from "react";

interface UseFormResponse {
  notify: (name: string, isValid: boolean) => void
  validateForm: () => boolean
}

const useForm = (): UseFormResponse => {
  const [validation, setValidation] = useState<{[key: string]: boolean}>({});

  const notify = (name: string, isValid: boolean) => {
    setValidation({ ...validation, [name]: isValid });
  }
  
  const validateForm = (): boolean => {
    let isValid = true;

    for(const key in validation) {
      if(!validation[key]) {
        isValid = false;
        break;
      }
    }

    return isValid;
  }

  return { notify, validateForm }
}

export default useForm;
