import { FileRenderer } from "@/components/core/FileRenderer";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MessageCircleIcon, NotepadTextIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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
        <FileRenderer fileId={fileId} />
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
