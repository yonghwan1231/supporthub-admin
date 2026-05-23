"use client";

import { usePromiseModal } from "@jyh-dev/kit";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/common/components/ui/button";
import { Select } from "@/common/components/ui/field";
import { ReplyComposer } from "@/tickets/components/reply-composer";
import {
  TicketReplyHistory,
  TicketSummaryCard,
} from "@/tickets/components/ticket-detail-sections";
import { ticketService } from "@/tickets/services/ticket.service";

export function TicketDetailPage({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const modal = usePromiseModal();
  const ticketQuery = ticketService.queries.useGetTicket({
    variables: ticketId,
  });
  const updateStatus = ticketService.mutations.useUpdateStatus();
  const deleteTicket = ticketService.mutations.useDeleteTicket();
  const ticket = ticketQuery.data;

  const changeStatus = async (status: $Ticket.Status) => {
    if (!ticket) return;

    const ok = await modal.confirm({
      title: "문의 상태를 변경할까요?",
      description: `"${ticket.title}" 문의의 상태를 변경합니다.`,
      confirmText: "변경",
      cancelText: "취소",
    });

    if (!ok) return;
    await updateStatus.mutateAsync({ id: ticket.id, status });
  };

  const removeTicket = async () => {
    if (!ticket) return;

    const ok = await modal.confirm({
      title: "문의를 삭제할까요?",
      description: "삭제한 문의는 삭제된 문의 메뉴에서 확인할 수 있습니다.",
      tone: "danger",
      confirmText: "삭제",
      cancelText: "취소",
    });

    if (!ok) return;
    await deleteTicket.mutateAsync(ticket.id);
    router.push("/tickets");
  };

  return (
    <section className="page overflow-auto">
      <Link
        className="inline-flex w-fit items-center gap-2 text-sm font-bold text-muted transition hover:text-ink"
        href="/tickets"
      >
        <ArrowLeft className="h-4 w-4" />
        문의 목록
      </Link>

      {ticketQuery.isLoading ? (
        <div className="rounded-md border border-line bg-panel p-8">
          <div className="h-6 w-52 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-24 animate-pulse rounded-md bg-slate-100" />
        </div>
      ) : null}

      {!ticketQuery.isLoading && !ticket ? (
        <div className="rounded-md border border-line bg-panel p-8 text-center">
          <p className="text-sm font-bold text-muted">
            문의를 찾을 수 없습니다.
          </p>
        </div>
      ) : null}

      {ticket ? (
        <>
          <TicketSummaryCard
            actions={
              <>
                <Select
                  className="w-36"
                  value={ticket.status}
                  onChange={(event) =>
                    void changeStatus(event.target.value as $Ticket.Status)
                  }
                >
                  <option value="open">대기</option>
                  <option value="in_progress">처리중</option>
                  <option value="resolved">완료</option>
                  <option value="hold">보류</option>
                </Select>
                <Button onClick={removeTicket} type="button" variant="danger">
                  <Trash2 className="h-4 w-4" />
                  삭제
                </Button>
              </>
            }
            ticket={ticket}
          />

          <TicketReplyHistory replies={ticket.replies} />

          <ReplyComposer ticketId={ticket.id} />
        </>
      ) : null}
    </section>
  );
}
