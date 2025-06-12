import { useMutation } from "@tanstack/react-query";

export const storageApi = {
  uploadImage: async (file: File) => {
    await sleep(3000);

    // throw new Error("mock failed");

    return {
      url: URL.createObjectURL(file),
    };
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useUploadImage = () => {
  return useMutation({
    mutationFn: storageApi.uploadImage,
  });
};
