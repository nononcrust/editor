export const uploadImage = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate upload delay
  return URL.createObjectURL(file);
};
