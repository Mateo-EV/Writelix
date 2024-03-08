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

export const usePdfBase64 = (url: string) => {
  return useQuery({
    queryKey: ["renderPDF", url],
    queryFn: async () => {
      const request = await fetch(url);
      const blob = await request.blob();

      const base64: string = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("loadend", () => {
          resolve(reader.result as string);
        });
        reader.readAsDataURL(blob);
      });

      return base64;
    },
  });
};
