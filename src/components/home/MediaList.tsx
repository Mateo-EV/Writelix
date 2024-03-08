"use client";

import { api } from "@/trpc/react";
import { type RouterInputs } from "@/trpc/shared";
import { useSearchParams } from "next/navigation";
import { EmptyMessage } from "../EmptyMessage";
import { Media } from "../dashboard/Media";
import { AlertMessage } from "../ui/alert";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

export const MediaList = () => {
  const searchParams = useSearchParams();

  const type = searchParams.get(
    "type",
  ) as RouterInputs["home"]["getFilesAndDocumentation"]["type"];

  const {
    data: media,
    isLoading,
    isError,
  } = api.home.getFilesAndDocumentation.useQuery(
    {
      search: searchParams.get("search"),
      type,
    },
    {
      retry: (_, err) => Boolean(err.data?.zodError?.fieldErrors),
    },
  );

  if (isError)
    return <AlertMessage type="destructive" title="Something went wrong" />;

  if (isLoading)
    return (
      <Skeleton
        containerClassName="block space-y-4"
        height={100}
        borderRadius={10}
        count={4}
      />
    );

  if (!media || media.length === 0) return <EmptyMessage />;

  return (
    <ScrollArea>
      <div className="grid auto-rows-[24rem] grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] gap-4">
        {media.map((media) => (
          <Media media={media} key={media.id + searchParams.toString()} />
        ))}
      </div>
    </ScrollArea>
  );
};
