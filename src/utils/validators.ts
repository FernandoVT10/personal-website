const EMAIL_VALIDATOR_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const email = (value: string) => EMAIL_VALIDATOR_REGEX.test(value) ? null : "The email is invalid";
