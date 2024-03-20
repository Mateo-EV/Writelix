"use client";

import { buttonVariants } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileStatus } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { ChevronLeftIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { ChatProvider } from "./ChatProvider";
import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";

type ChatWrapperProps = {
  fileId: string;
};

export const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data: fileStatus, isLoading } = api.file.getFileStatus.useQuery(
    fileId,
    {
      refetchInterval: (status) =>
        status === FileStatus.SUCCESS || status === FileStatus.FAILED
          ? false
          : 500,
    },
  );

  if (isLoading || !fileStatus)
    return (
      <>
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner className="size-8 text-primary" />
            <h3 className="text-xl font-semibold">Loading...</h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>
        <ChatInput disabled />
      </>
    );

  if (fileStatus === FileStatus.PROCESSING)
    return (
      <>
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner className="size-8 text-primary" />
            <h3 className="text-xl font-semibold">Processing PDF...</h3>
            <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
          </div>
        </div>
        <ChatInput disabled />
      </>
    );

  if (fileStatus === FileStatus.FAILED)
    return (
      <>
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <h3 className="text-xl font-semibold">Too many pages in PDF</h3>
            <p className="text-sm text-zinc-500">
              Your <span className="font-medium">Free</span> plan supports up to
              5 pages per PDF.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeftIcon className="mr-1.5 h-3 w-3" />
              Back
            </Link>
          </div>
        </div>
        <ChatInput disabled />
      </>
    );

  return (
    <ChatProvider fileId={fileId}>
      <div className="mb-[5.25rem] flex flex-1 flex-col justify-between">
        <Messages fileId={fileId} />
      </div>
      <ChatInput />
    </ChatProvider>
  );
};
