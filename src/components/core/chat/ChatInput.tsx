"use client";

import { useRef } from "react";
import { useChat } from "./ChatProvider";
import { Button } from "@/components/ui/button";
import { SendHorizontalIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
  disabled?: boolean;
};

export const ChatInput = ({ disabled }: ChatInputProps) => {
  const { sendMessage, handleInputChange, isLoading, message } = useChat();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex w-full flex-grow flex-col p-4">
            <div className="relative">
              <Textarea
                rows={1}
                maxRows={4}
                placeholder="Enter your question..."
                autoFocus
                ref={textAreaRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                    textAreaRef.current?.focus();
                  }
                }}
                onChange={handleInputChange}
                value={message}
                className="resize-none py-3 pr-12 text-base"
              />

              <Button
                disabled={disabled ?? isLoading}
                className="absolute bottom-1.5 right-[5px]"
                aria-label="send message"
                size="icon"
                onClick={() => {
                  sendMessage();
                  textAreaRef.current?.focus();
                }}
              >
                <SendHorizontalIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
