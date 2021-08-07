const EMAIL_VALIDATOR_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const imageValidator = (imageType: string): boolean => {
  if(imageType === "image/png" || imageType === "image/jpg" || imageType === "image/jpeg") return true;

  return false;
}

export const email = (value: string) => EMAIL_VALIDATOR_REGEX.test(value);

export const inputValidators = {
  email: (value: string) => email(value) ? null : "The email is invalid",
  requiredInput: (name: string) => (value: string) => value.length ? null : `The ${name} is required`
}
