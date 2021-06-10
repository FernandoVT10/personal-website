const EMAIL_VALIDATOR_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const imageValidator = (imageType: string): boolean => {
  if(imageType === "image/png" || imageType === "image/jpg" || imageType === "image/jpeg") return true;

  return false;
}

export const emailValidator = (email: string): boolean => EMAIL_VALIDATOR_REGEX.test(email)
