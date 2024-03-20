"use client";

import { api } from "@/trpc/react";
import { AlertMessage } from "../ui/alert";
import { EmptyMessage } from "../EmptyMessage";
import { Skeleton } from "../ui/skeleton";
import { MediaSmall } from "./MediaSmall";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import DeleteUploadModal from "../modals/DeleteUploadModal";

export const UploadList = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("search")?.toLowerCase();

  const {
    data: files,
    isLoading,
    isError,
  } = api.file.getAll.useQuery(undefined);

  if (isError)
    return <AlertMessage type="destructive" title="Something went wrong" />;

  if (isLoading)
    return (
      <Skeleton
        containerClassName="block space-y-4"
        height={40}
        borderRadius={10}
        count={6}
      />
    );

  const filesFiltered = search
    ? files.filter((file) => file.name.toLowerCase().includes(search))
    : files;

  if (!filesFiltered || filesFiltered.length === 0) return <EmptyMessage />;

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filesFiltered.map((file) => (
              <MediaSmall key={file.id} media={file} />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <DeleteUploadModal />
    </>
  );
};
