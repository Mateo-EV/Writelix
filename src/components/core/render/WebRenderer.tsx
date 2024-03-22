"use client";

import { AlertMessage } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useWebScreenshot } from "@/lib/fetch";
import Image from "next/image";

type WebRendererProps = {
  fileId: string;
};

export const WebRenderer = ({ fileId }: WebRendererProps) => {
  const { data: url, isLoading } = useWebScreenshot(fileId);

  if (isLoading)
    return (
      <div className="grid size-full place-items-center">
        <LoadingSpinner className="size-8" />
      </div>
    );

  if (!url)
    return (
      <AlertMessage
        type="destructive"
        title="Image not found"
        description="It seems there was a problem loading the image"
      />
    );

  return (
    <div className="relative size-full overflow-hidden rounded-t-md">
      <Image
        src={url}
        alt="screensht"
        fill
        className="object-cover object-top"
      />
    </div>
  );
};
