const EMAIL_VALIDATOR_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const imageValidator = (imageType: string): boolean => {
  if(imageType.startsWith("image/")) return true;

  return false;
}

export const email = (value: string) => EMAIL_VALIDATOR_REGEX.test(value);

export const inputValidators = {
  email: (value: string) => email(value) ? null : "The email is invalid",
}
