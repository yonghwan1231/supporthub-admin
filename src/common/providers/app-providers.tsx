"use client";

import { useState } from "react";
import { createPromiseModal } from "@jyh-dev/kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/common/lib/react-global";

export const appModal = createPromiseModal({});

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 20,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <appModal.Provider
        defaultOptions={{
          classNames: {
            panel: "max-w-lg",
            button: "min-w-20",
          },
        }}
      >
        {children}
      </appModal.Provider>
    </QueryClientProvider>
  );
}
