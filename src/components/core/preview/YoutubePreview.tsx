"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type YoutubePreviewProps = Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt"
> & {
  keyYoutube: string;
};

export const YoutubePreview = ({
  keyYoutube,
  className,
  ...props
}: YoutubePreviewProps) => {
  const urlImage = `https://img.youtube.com/vi/${keyYoutube}/maxresdefault.jpg`;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Image
        src={urlImage}
        alt="youtube-video"
        fill
        onLoad={() => setIsLoading(false)}
        className={cn("size-full object-cover", className)}
        style={{ opacity: isLoading ? "0" : "1" }}
        {...props}
      />
    </>
  );
};
