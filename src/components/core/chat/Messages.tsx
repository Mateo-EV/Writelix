"use client";

import { api } from "@/trpc/react";
import { MessageSquareIcon } from "lucide-react";
import { Message } from "./Message";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "./ChatProvider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef } from "react";

type MessagesProps = {
  fileId: string;
};

export const Messages = ({ fileId }: MessagesProps) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    api.file.getMessages.useInfiniteQuery(
      { fileId },
      {
        getNextPageParam: (lastMessage) => lastMessage.nextCursor,
      },
    );

  const { isLoading: isAiThinking } = useChat();

  const messages = data?.pages.flatMap((page) => page.messages);
  const existsMessages = messages ? messages?.length > 0 : false;
  const rootRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: rootRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      void fetchNextPage();
    }
  }, [entry?.isIntersecting, fetchNextPage]);

  if (isLoading)
    return (
      <Skeleton
        containerClassName="flex-1 p-2"
        className="size-full"
        style={{ lineHeight: "normal" }}
      />
    );

  if (!existsMessages)
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <MessageSquareIcon className="size-8 text-primary" />
        <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
        <p className="text-sm text-zinc-500">
          Ask your first question to get started.
        </p>
      </div>
    );

  return (
    <div
      ref={rootRef}
      className="scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded flex max-h-[calc(100vh-3.5rem-9.9rem)] flex-1 animate-fade-in flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3"
    >
      {isAiThinking && (
        <Message
          key="loading-message"
          message={{
            id: "loading-message",
            content: (
              <span className="flex h-full items-center justify-center">
                <LoadingSpinner />
              </span>
            ),
            createdAt: new Date(),
            isIAMessage: true,
          }}
        />
      )}
      {messages!.map(({ id, content, response, createdAt }, i) => (
        <>
          {response && (
            <Message
              key={id + "ia"}
              message={{
                id,
                content: response,
                createdAt,
                isIAMessage: true,
              }}
            />
          )}
          {i === messages!.length - 1 ? (
            <Message
              key={id}
              message={{ id, content, createdAt, isIAMessage: false }}
              ref={ref}
            />
          ) : (
            <Message
              key={id}
              message={{ id, content, createdAt, isIAMessage: false }}
            />
          )}
        </>
      ))}

      {isFetchingNextPage && (
        <div className="grid min-h-10 place-items-center">
          <LoadingSpinner className="size-6" />
        </div>
      )}
    </div>
  );
};
