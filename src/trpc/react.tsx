"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { TRPCClientError, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

import { type AppRouter } from "@/server/api/root";
import { getUrl, transformer } from "./shared";
import { toast } from "sonner";

export const api = createTRPCReact<AppRouter>();

const mutationCache = new MutationCache({
  onError: (error) => {
    if (error instanceof TRPCClientError) {
      toast.error(error.message ? error.message : "Something went wrong");
    } else toast.error("Something went wrong");
  },
  onSuccess: (defaultData) => {
    const data = defaultData as { message?: string } | undefined;
    if (data?.message) toast.success(data.message);
  },
});

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache,
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            cacheTime: Infinity,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          url: getUrl(),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
