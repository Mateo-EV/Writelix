"use client";

import { AlertMessage } from "@/components/ui/alert";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [quality, setQuality] = useState<"maxresdefault" | "hqdefault">(
    "maxresdefault",
  );

  const urlImage = `https://img.youtube.com/vi/${keyYoutube}/${quality}.jpg`;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {isError && (
        <AlertMessage
          type="destructive"
          title="Not found"
          description="It seems this youtube video doesn't exists"
        />
      )}
      <Image
        src={urlImage}
        alt="youtube-video"
        fill
        onLoad={() => {
          setIsLoading(false);
          setIsError(false);
        }}
        onError={() => {
          if (quality === "maxresdefault") {
            setQuality("hqdefault");
          } else if (quality === "hqdefault") {
            setIsLoading(false);
            setIsError(true);
          }
        }}
        className={cn("size-full object-cover", className)}
        style={{ opacity: isLoading || isError ? "0" : "1" }}
        {...props}
      />
    </>
  );
};
