"use client";

import { FileType } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { PdfRenderer } from "./render/PdfRenderer";
import { STORAGE_URL } from "@/config";

type FileRendererProps = {
  file: NonNullable<RouterOutputs["file"]["getByFileId"]>;
};

export const FileRenderer = ({ file }: FileRendererProps) => {
  const { data } = api.file.getByFileId.useQuery(file.id, {
    initialData: file,
  });

  const currentFile = data!;

  if (currentFile.type === FileType.PDF)
    return <PdfRenderer url={STORAGE_URL + currentFile.key} />;

  return <div>{currentFile.type}</div>;
};
