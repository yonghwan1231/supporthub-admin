"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProjectIntroModal } from "@/common/components/layout/project-intro-modal";
import { appModal } from "@/common/modals/app-modal";
import { UrgentTicketNotifier } from "@/tickets/components/urgent-ticket-notifier";
import "@/common/lib/react-global";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            gcTime: 0,
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
            panel: "w-auto",
            button: "min-w-20",
          },
        }}
      >
        {children}
        <ProjectIntroModal />
        <UrgentTicketNotifier />
      </appModal.Provider>
    </QueryClientProvider>
  );
}
