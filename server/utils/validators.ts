const EMAIL_VALIDATOR_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const imageValidator = (imageType: string): boolean => imageType.startsWith("image/");

export const emailValidator = (email: string): boolean => EMAIL_VALIDATOR_REGEX.test(email)
