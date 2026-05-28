"use client";

import { useState } from "react";
import { useSse } from "@jyh-dev/kit/realtime";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { dashboardService } from "@/dashboard/services/dashboard.service";
import { ticketService } from "@/tickets/services/ticket.service";

type UrgentToast = $Ticket.UrgentTicketEvent & {
  receivedAt: number;
};

export function UrgentTicketNotifier() {
  const queryClient = useQueryClient();
  const [toasts, setToasts] = useState<UrgentToast[]>([]);
  const isRealtimeEnabled =
    process.env.NEXT_PUBLIC_SUPPORTHUB_ENABLE_REALTIME === "true";

  useSse<$Ticket.RealtimeEvents>({
    enabled: isRealtimeEnabled,
    events: {
      "ticket.urgent": (payload) => {
        queryClient.invalidateQueries({
          queryKey: ticketService.keys.list.getTickets(),
        });
        queryClient.invalidateQueries({
          queryKey: dashboardService.keys.summary.getDashboard(),
        });

        const toast = {
          ...payload,
          receivedAt: Date.now(),
        };

        setToasts((current) => [toast, ...current].slice(0, 3));
        window.setTimeout(() => {
          setToasts((current) =>
            current.filter((item) => item.receivedAt !== toast.receivedAt),
          );
        }, 10000);
      },
    },
    url: "/api/realtime/tickets",
  });

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 grid w-[min(360px,calc(100vw-40px))] gap-2">
      {toasts.map((toast) => (
        <div
          className="rounded-md border border-red-200 bg-white p-4 shadow-xl"
          key={toast.receivedAt}
        >
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-red-700">
                긴급 문의가 접수되었습니다
              </p>
              <Link
                className="mt-1 block truncate text-sm font-semibold text-ink hover:text-brand"
                href={`/tickets/${toast.id}`}
              >
                {toast.title}
              </Link>
              <p className="mt-1 text-xs font-semibold text-muted">
                {toast.customerName}
              </p>
            </div>
            <button
              aria-label="알림 닫기"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted transition hover:bg-slate-100 hover:text-ink"
              onClick={() =>
                setToasts((current) =>
                  current.filter(
                    (item) => item.receivedAt !== toast.receivedAt,
                  ),
                )
              }
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
