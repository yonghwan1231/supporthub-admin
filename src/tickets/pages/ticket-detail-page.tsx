"use client";

import { usePromiseModal } from "@jyh-dev/kit";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Select } from "@/common/components/ui/field";
import { formatDateTime, formatFileSize } from "@/common/lib/format";
import { ReplyComposer } from "@/tickets/components/reply-composer";
import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/tickets/components/ticket-badges";
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
      description: "삭제한 문의는 복구할 수 없습니다.",
      tone: "danger",
      confirmText: "삭제",
      cancelText: "취소",
    });

    if (!ok) return;
    await deleteTicket.mutateAsync(ticket.id);
    router.push("/tickets");
  };

  return (
    <section className="space-y-5">
      <Link
        className="inline-flex w-fit items-center gap-2 text-sm font-bold text-muted transition hover:text-ink"
        href="/tickets"
      >
        <ArrowLeft className="h-4 w-4" />
        문의 목록
      </Link>

      {ticketQuery.isLoading ? (
        <div className="rounded-md border border-line bg-panel p-8 shadow-sm">
          <div className="h-6 w-52 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-24 animate-pulse rounded-md bg-slate-100" />
        </div>
      ) : null}

      {!ticketQuery.isLoading && !ticket ? (
        <div className="rounded-md border border-line bg-panel p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-muted">
            문의를 찾을 수 없습니다.
          </p>
        </div>
      ) : null}

      {ticket ? (
        <>
          <article className="rounded-md border border-line bg-panel p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <CategoryBadge category={ticket.category} />
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
                  {ticket.title}
                </h1>
                <p className="mt-2 text-sm font-semibold text-muted">
                  {ticket.customerName} · {ticket.customerEmail} ·{" "}
                  {formatDateTime(ticket.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
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
              </div>
            </div>

            <p className="mt-6 whitespace-pre-wrap rounded-md bg-slate-50 p-5 text-sm leading-7 text-ink">
              {ticket.content}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {ticket.tags.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
          </article>

          <section className="rounded-md border border-line bg-panel p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">처리 이력</h2>
            <div className="mt-5 space-y-4">
              {ticket.replies.length === 0 ? (
                <p className="rounded-md bg-slate-50 p-5 text-sm font-medium text-muted">
                  아직 등록된 답변이 없습니다.
                </p>
              ) : (
                ticket.replies.map((reply) => (
                  <div
                    className="rounded-md border border-line p-4"
                    key={reply.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-slate-900">
                        {reply.authorName}
                      </p>
                      <p className="text-xs font-semibold text-muted">
                        {formatDateTime(reply.createdAt)}
                      </p>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {reply.message}
                    </p>
                    {reply.attachments.length > 0 ? (
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {reply.attachments.map((attachment) => (
                          <li key={attachment.id}>
                            <a
                              className="block rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-muted transition hover:bg-slate-100 hover:text-ink"
                              href={attachment.fileUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              {attachment.originalName}
                              <span className="ml-2 text-xs text-muted">
                                {formatFileSize(attachment.fileSize)}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </section>

          <ReplyComposer ticketId={ticket.id} />
        </>
      ) : null}
    </section>
  );
}
