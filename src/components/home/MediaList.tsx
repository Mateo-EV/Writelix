"use client";

import { api } from "@/trpc/react";
import { Ghost } from "lucide-react";
import { Skeleton } from "../shared/Skeleton";
import { Media } from "./Media";

export const MediaList = () => {
  const { data: media, isLoading } = api.home.getFilesAndDocumentation.useQuery(
    {},
  );

  if (isLoading) {
    return (
      <Skeleton
        containerClassName="block space-y-4"
        height={100}
        borderRadius={10}
        count={4}
      />
    );
  }

  if (!media || media.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-2">
        <Ghost className="h-8 w-8 text-zinc-800" />
        <h3 className="text-xl font-semibold">Pretty empty around here</h3>
        <p>Let&apos;s upload something new...</p>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-[24rem] grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] gap-4">
      {media.map((media) => (
        <Media media={media} key={media.id} />
      ))}
    </div>
  );
};
