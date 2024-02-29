"use client";

import { api } from "@/trpc/react";
import { Skeleton } from "../shared/Skeleton";

export const FilesList = () => {
  const { data: files, isLoading } = api.file.getAll.useQuery({});

  if (true) {
    return (
      <Skeleton
        containerClassName="block space-y-4"
        height={100}
        borderRadius={10}
      />
    );
  }

  return <div>FilesList</div>;
};
