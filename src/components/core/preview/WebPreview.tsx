/* eslint-disable @next/next/no-img-element */
"use client";

import { useLogoFromUrl } from "@/lib/fetch";
import { LoadingSpinner } from "../../ui/loading-spinner";
import { Icons } from "../../Icons";
import { cn } from "@/lib/utils";

type WebPreviewProps = {
  className: string;
  url: string;
  // type?: "full" | "icon";
};

export const WebPreview = ({
  url,
  className,
  // type = "full",
}: WebPreviewProps) => {
  const { data, isLoading } = useLogoFromUrl(url);

  if (isLoading) return <LoadingSpinner />;

  if (!data)
    return (
      <Icons.web
        className={cn(
          // type === "full" ? "size-28 text-gray-400" : "size-8 text-green-500",
          "size-28 text-gray-400",
          className,
        )}
      />
    );

  if (data) {
    return (
      <div
        className={cn(
          "flex w-3/4 flex-col items-center gap-2 text-center",
          className,
        )}
      >
        {data.urlImage && (
          <img src={data.urlImage} alt="logo-web" className="size-6" />
        )}
        <p className="text-sm font-semibold text-muted-foreground">
          {data.title}
        </p>
        <p className="text-xs">{data.description}</p>
      </div>
    );
  }
};
