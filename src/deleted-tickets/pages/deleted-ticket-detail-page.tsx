"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/common/lib/format";
import {
  useDeletedTicketAccessGate,
  useDeletedTicketUnauthorizedHandler,
} from "@/deleted-tickets/hooks/use-deleted-ticket-access";
import { deletedTicketService } from "@/deleted-tickets/services/deleted-ticket.service";
import {
  TicketReplyHistory,
  TicketSummaryCard,
} from "@/tickets/components/ticket-detail-sections";

export function DeletedTicketDetailPage({
  deletedTicketId,
}: {
  deletedTicketId: string;
}) {
  const { password } = useDeletedTicketAccessGate();
  const deletedTicketQuery = deletedTicketService.queries.useGetDeletedTicket({
    enabled: Boolean(password),
    retry: false,
    variables: {
      deletedTicketId,
      password: password ?? "",
    },
  });

  useDeletedTicketUnauthorizedHandler(deletedTicketQuery.error);

  const deletedTicket = deletedTicketQuery.data;
  const ticket = deletedTicket?.ticket;

  return (
    <section className="page overflow-auto">
      <Link
        className="inline-flex w-fit items-center gap-2 text-sm font-bold text-muted transition hover:text-ink"
        href="/deleted-tickets"
      >
        <ArrowLeft className="h-4 w-4" />
        삭제된 문의
      </Link>

      {deletedTicketQuery.isLoading ? (
        <div className="rounded-md border border-line bg-panel p-8">
          <div className="h-6 w-52 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-24 animate-pulse rounded-md bg-slate-100" />
        </div>
      ) : null}

      {!deletedTicketQuery.isLoading && !ticket ? (
        <div className="rounded-md border border-line bg-panel p-8 text-center">
          <p className="text-sm font-bold text-muted">
            삭제된 문의를 찾을 수 없습니다.
          </p>
        </div>
      ) : null}

      {deletedTicket && ticket ? (
        <>
          <TicketSummaryCard
            actions={
              <div className="rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                삭제 일시 {formatDateTime(deletedTicket.deletedAt)}
              </div>
            }
            ticket={ticket}
          />
          <section className="rounded-md border border-line bg-panel p-6">
            <h2 className="text-lg font-bold text-ink">삭제 보관 정보</h2>
            <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">
              <InfoItem label="삭제 보관 ID" value={deletedTicket.id} />
              <InfoItem label="원본 문의 ID" value={deletedTicket.originalId} />
              <InfoItem
                label="마지막 업데이트"
                value={formatDateTime(ticket.updatedAt)}
              />
              <InfoItem label="삭제 처리자" value={deletedTicket.deletedBy} />
            </dl>
          </section>

          <TicketReplyHistory replies={ticket.replies} />
        </>
      ) : null}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-muted">{label}</dt>
      <dd className="mt-1 break-all font-semibold text-ink">{value}</dd>
    </div>
  );
}
