import { AudioRenderer } from "@/components/core/render/AudioRenderer";
import { PdfRenderer } from "@/components/core/render/PdfRenderer";
import { WebRenderer } from "@/components/core/render/WebRenderer";
import { YoutubeRenderer } from "@/components/core/render/YoutubeRenderer";
import { STORAGE_URL } from "@/config";
import { getSession } from "@/lib/auth";
import { getFileById } from "@/server/api/routers";
import { FileType } from "@/server/db/schema";
import { notFound } from "next/navigation";

type FileRendererProps = {
  fileId: string;
};

const fileRendererContent = (key: string, name: string) => ({
  [FileType.PDF]: <PdfRenderer url={STORAGE_URL + key} />,
  [FileType.WEB]: <WebRenderer url={key} />,
  [FileType.AUDIO]: <AudioRenderer url={STORAGE_URL + key} name={name} />,
  [FileType.YOUTUBE]: <YoutubeRenderer keyYoutube={key} />,
});

export const FileRenderer = async ({ fileId }: FileRendererProps) => {
  const session = (await getSession())!;

  const file = await getFileById(fileId, session.user.id);

  if (!file) return notFound();

  return fileRendererContent(file.key, file.name)[file.type];
};
