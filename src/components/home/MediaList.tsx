"use client";

import { api } from "@/trpc/react";
import { Ghost } from "lucide-react";
import { Skeleton } from "../shared/Skeleton";
import { AlertMessage } from "../ui/alert";
import { Media } from "./Media";
import { ScrollArea } from "../ui/scroll-area";
import { useSearchParams } from "next/navigation";
import { type RouterInputs } from "@/trpc/shared";

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

  if (!media || media.length === 0)
    return (
      <div className="mt-16 flex flex-col items-center gap-2">
        <Ghost className="h-8 w-8 text-zinc-800" />
        <h3 className="text-xl font-semibold">Pretty empty around here</h3>
        <p>Let&apos;s upload something new...</p>
      </div>
    );

  return (
    <ScrollArea>
      <div className="grid auto-rows-[24rem] grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] gap-4 pr-3">
        {media.map((media) => (
          <Media media={media} key={media.id + searchParams.toString()} />
        ))}
      </div>
    </ScrollArea>
  );
};
