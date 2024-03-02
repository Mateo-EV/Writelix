import { getLogoFromUrl } from "@/app/_actions/web";
import { useQuery } from "@tanstack/react-query";

export const useLogoFromUrl = (url: string) => {
  return useQuery({
    queryFn: async () => {
      return await getLogoFromUrl(url);
    },
    queryKey: ["logoFromUrl", url],
  });
};
