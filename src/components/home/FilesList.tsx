"use client";

import { api } from "@/trpc/react";
import { Skeleton } from "../shared/Skeleton";

export const FilesList = () => {
  const { data: files, isLoading } = api.file.getAll.useQuery(
    {},
    // { refetchInterval: 1000 },
  );

  if (isLoading) {
    return <Skeleton />;
  }

  return <div>FilesList</div>;
};
