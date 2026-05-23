"use client";

import { Badge } from "@/common/components/ui/badge";
import { formatDateTime, formatFileSize } from "@/common/lib/format";
import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/tickets/components/ticket-badges";
import { getAttachmentDownloadUrl } from "@/tickets/lib/attachment-links";
import type { ReactNode } from "react";

export function TicketSummaryCard({
  actions,
  ticket,
}: {
  actions?: ReactNode;
  ticket: $Ticket.Item;
}) {
  return (
    <article className="rounded-md border border-line bg-panel p-6">
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

        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
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
  );
}

export function TicketReplyHistory({ replies }: { replies: $Ticket.Reply[] }) {
  return (
    <section className="rounded-md border border-line bg-panel p-6">
      <h2 className="text-lg font-bold text-ink">처리 이력</h2>
      <div className="mt-5 space-y-4">
        {replies.length === 0 ? (
          <p className="rounded-md bg-slate-50 p-5 text-sm font-medium text-muted">
            아직 등록된 답변이 없습니다.
          </p>
        ) : (
          replies.map((reply) => (
            <div className="rounded-md border border-line p-4" key={reply.id}>
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
                        href={getAttachmentDownloadUrl(attachment)}
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
  );
}
