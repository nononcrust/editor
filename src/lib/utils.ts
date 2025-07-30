import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const uploadImage = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate upload delay
  return URL.createObjectURL(file);
};
