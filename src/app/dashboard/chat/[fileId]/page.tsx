import { FileRenderer } from "@/components/core/FileRenderer";
import { ChatWrapper } from "@/components/core/chat/ChatWrapper";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function ChatIdPage({
  params: { fileId },
}: {
  params: { fileId: string };
}) {
  return (
    <DashboardContainer>
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <Suspense
          fallback={
            <Skeleton
              className="size-full"
              containerClassName="p-2"
              style={{ lineHeight: "normal" }}
            />
          }
        >
          <Card className="hidden lg:block [&>div]:h-full">
            <FileRenderer fileId={fileId} />
          </Card>
        </Suspense>
        <Card className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50 dark:divide-zinc-800 dark:bg-zinc-950">
          <ChatWrapper fileId={fileId} />
        </Card>
      </div>
    </DashboardContainer>
  );
}
