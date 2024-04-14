import { useNuxtApp } from "#app";
export const useDevice = () => {
  return useNuxtApp().$device;
};
