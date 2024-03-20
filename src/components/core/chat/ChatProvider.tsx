"use client";

import { api } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

type ChatContextProps = {
  message: string;
  isLoading: boolean;
  sendMessage: () => void;
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export const ChatContext = createContext<ChatContextProps>({
  message: "",
  isLoading: false,
  sendMessage: undefined as unknown as ChatContextProps["sendMessage"],
  handleInputChange:
    undefined as unknown as ChatContextProps["handleInputChange"],
});

type ChatProviderProps = {
  fileId: string;
  children: React.ReactNode;
};

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ fileId, children }: ChatProviderProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const globalApi = api.useUtils();

  const { mutate: addMessage } = useMutation({
    mutationFn: async (message: string) => {
      const req = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ message, fileId }),
      });

      if (!req.ok) throw new Error("Failed to send message");

      return req.body;
    },
    onMutate: () => {
      setMessage("");
      void globalApi.file.getMessages.cancel();
      const idMessageOptimistic = crypto.randomUUID();
      const previousMessages = globalApi.file.getMessages.getInfiniteData();
      globalApi.file.getMessages.setInfiniteData({ fileId }, (oldMessages) => {
        if (!oldMessages) return;

        const oldPages = [...oldMessages.pages];
        const lastestPage = oldPages.shift()!;

        return {
          ...oldMessages,
          pages: [
            {
              ...lastestPage,
              messages: [
                {
                  id: idMessageOptimistic,
                  createdAt: new Date(),
                  content: message,
                  response: "",
                },
                ...lastestPage.messages,
              ],
            },
            ...oldPages,
          ],
        };
      });

      setIsLoading(true);

      return { previousMessages, message, idMessageOptimistic };
    },
    onError: (_, __, context) => {
      globalApi.file.getMessages.setInfiniteData(
        { fileId },
        context?.previousMessages,
      );
      setMessage(context?.message ?? "");
    },

    onSettled: () => setIsLoading(false),
    onSuccess: (stream, _, context) => {
      if (!stream || !context?.idMessageOptimistic)
        return toast.error("There was a problem sending the message");

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      const id = context.idMessageOptimistic;

      // globalApi.file.getMessages.setInfiniteData({ fileId }, (oldMessages) => {
      //   if (!oldMessages) return;
      //   const oldPages = [...oldMessages.pages];
      //   const lastestPage = oldPages.shift()!;

      //   return {
      //     ...oldMessages,
      //     pages: [
      //       {
      //         ...lastestPage,
      //         messages: [
      //           {
      //             id,
      //             createdAt: new Date(),
      //             isIAMessage: true,
      //             content: "",
      //           },
      //           ...lastestPage.messages,
      //         ],
      //       },
      //       ...oldPages,
      //     ],
      //   };
      // });

      const buildMessageFromAI = async () => {
        const { done, value } = await reader.read();

        if (done) return;

        const chunkValue = decoder.decode(value);

        globalApi.file.getMessages.setInfiniteData(
          { fileId },
          (oldMessages) => {
            if (!oldMessages) return;
            const oldPages = oldMessages.pages;
            const lastestPage = oldPages.shift()!;

            const indexMessage = lastestPage.messages.findIndex(
              (message) => message.id === id,
            );
            const messageToUpdate = lastestPage.messages[indexMessage]!;

            lastestPage.messages[indexMessage] = {
              ...messageToUpdate,
              response: messageToUpdate.response + chunkValue,
            };

            return {
              ...oldMessages,
              pages: [lastestPage, ...oldPages],
            };
          },
        );

        void buildMessageFromAI();
      };

      void buildMessageFromAI();
    },
  });

  const sendMessage = () => {
    if (message) addMessage(message);
  };

  const handleInputChange: ChatContextProps["handleInputChange"] = (e) =>
    setMessage(e.target.value);

  return (
    <ChatContext.Provider
      value={{ message, isLoading, sendMessage, handleInputChange }}
    >
      {children}
    </ChatContext.Provider>
  );
};
