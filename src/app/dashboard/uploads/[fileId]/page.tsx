import { AudioRenderer } from "@/components/core/render/AudioRenderer";
import { PdfRenderer } from "@/components/core/render/PdfRenderer";
import { WebRenderer } from "@/components/core/render/WebRenderer";
import { YoutubeRenderer } from "@/components/core/render/YoutubeRenderer";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STORAGE_URL } from "@/config";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getFileById } from "@/server/api/routers";
import { FileType } from "@/server/db/schema";
import { MessageCircleIcon, NotepadTextIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type FileIdPageContentProps = {
  fileId: string;
};

const fileRendererContent = (key: string, name: string) => ({
  [FileType.PDF]: <PdfRenderer url={STORAGE_URL + key} />,
  [FileType.WEB]: <WebRenderer url={key} />,
  [FileType.AUDIO]: <AudioRenderer url={STORAGE_URL + key} name={name} />,
  [FileType.YOUTUBE]: <YoutubeRenderer keyYoutube={key} />,
});

const FileIdPageContent = async ({ fileId }: FileIdPageContentProps) => {
  const session = (await getSession())!;

  const file = await getFileById(fileId, session.user.id);

  if (!file) return notFound();

  return fileRendererContent(file.key, file.name)[file.type];
};

export default function FileIdPage({
  params: { fileId },
}: {
  params: { fileId: string };
}) {
  return (
    <Card className="grid flex-1 animate-fade-up grid-rows-[8fr_1fr]">
      <Suspense
        fallback={
          <Skeleton
            className="size-full"
            containerClassName="p-2"
            style={{ lineHeight: "normal" }}
          />
        }
      >
        <FileIdPageContent fileId={fileId} />
      </Suspense>
      <div className="flex items-center gap-2 p-2">
        <Link
          href={"/dashboard/chat/" + fileId}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-full flex-1",
          )}
        >
          <MessageCircleIcon className="mr-2 size-4" />
          Chat
        </Link>
        <Link
          href={"/dashboard/summaries"}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-full flex-1",
          )}
        >
          <NotepadTextIcon className="mr-2 size-4" />
          Resume
        </Link>
        <Link
          href={"/dashboard/create"}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-full flex-1",
          )}
        >
          <PlusIcon className="mr-2 size-4" />
          Create
        </Link>
      </div>
    </Card>
  );
}
