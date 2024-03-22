import { getLogoFromUrl, getUrlFromFileId } from "@/app/_actions/web";
import { useQuery } from "@tanstack/react-query";

export const useLogoFromUrl = (url: string) => {
  return useQuery({
    queryFn: async () => {
      return await getLogoFromUrl(url);
    },
    queryKey: ["logoFromUrl", url],
  });
};

export const useWebScreenshot = (fileId: string) => {
  return useQuery({
    queryFn: async () => {
      return await getUrlFromFileId(fileId);
    },
    queryKey: ["webScreenshot", fileId],
    refetchInterval: (data) => {
      if (!data) return 500;
      else return false;
    },
  });
};
