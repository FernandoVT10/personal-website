export const imageValidator = (imageType: string): boolean => {
  if(imageType === "image/png" || imageType === "image/jpg" || imageType === "image/jpeg") return true;

  return false;
}
