import { useQuery } from "@tanstack/react-query";

export const storageApi = {
  uploadImage: async (file: File) => {
    await sleep(1000);
    return {
      url: URL.createObjectURL(file),
    };
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useStorageImage = ({ file, id }: { file: File; id: string }) => {
  return useQuery({
    queryKey: ["storageImage", id],
    queryFn: () => storageApi.uploadImage(file),
    staleTime: Infinity,
  });
};
