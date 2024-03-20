import { cn, formatDateForChat } from "@/lib/utils";
import { BotIcon, UserIcon } from "lucide-react";
import { forwardRef } from "react";

type MessageProps = {
  message: {
    id: string;
    isIAMessage: boolean;
    createdAt: Date;
    content: string | JSX.Element;
  };
};

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message }, ref) => {
    return (
      <div
        className={cn("flex items-end", !message.isIAMessage && "justify-end")}
        ref={ref}
      >
        <div
          className={cn(
            "relative flex aspect-square size-6 items-center justify-center",
            message.isIAMessage
              ? "order-1 rounded-sm bg-zinc-800"
              : "order-2 rounded-sm bg-primary dark:bg-gray-900",
          )}
        >
          {message.isIAMessage ? (
            <BotIcon className="size-3/4 fill-zinc-300" />
          ) : (
            <UserIcon className="size-3/4 fill-foreground text-foreground" />
          )}
        </div>
        <div
          className={cn(
            "mx-2 flex max-w-md flex-col space-y-2 text-base",
            message.isIAMessage ? "order-2 items-start" : "order-1 items-end",
          )}
        >
          <div
            className={cn(
              "inline-block rounded-lg px-4 py-2",
              message.isIAMessage
                ? "rounded-bl-none bg-gray-200 text-gray-900"
                : "rounded-br-none bg-primary dark:bg-gray-900",
            )}
          >
            {typeof message.content === "string" ? (
              <p>{message.content}</p>
            ) : (
              message.content
            )}
            {message.id !== "loading-message" ? (
              <div
                className={cn(
                  "mt-2 w-full select-none text-right text-xs",
                  message.isIAMessage
                    ? "text-zinc-500"
                    : "text-gray-900 dark:text-muted-foreground",
                )}
              >
                {formatDateForChat(message.createdAt)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

Message.displayName = "Message";
