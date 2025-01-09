export const uploadImage = async (file: File) => {
  return URL.createObjectURL(file);
};
