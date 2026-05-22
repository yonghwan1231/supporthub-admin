"use client";

import { useEffect, useRef } from "react";
import { Table } from "@jyh-dev/kit";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/common/lib/format";
import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/tickets/components/ticket-badges";
import type { UseSelectionReturn } from "@jyh-dev/kit";

export function TicketTable({
  isLoading,
  selection,
  tickets,
}: {
  isLoading: boolean;
  selection: UseSelectionReturn<string>;
  tickets: $Ticket.GetTicketsItem[];
}) {
  const router = useRouter();
  const scope = selection.getScope();

  return (
    <Table.Root
      classNames={{
        root: "rounded-md border border-line bg-panel overflow-hidden",
        table: "min-w-[1040px] table-fixed text-left",
        head: "bg-slate-50 text-xs font-bold uppercase text-muted",
        row: "hover:bg-blue-50/40",
        cell: "px-4 py-2",
        header: "px-4 py-3",
      }}
      colgroup={[52, "auto", 136, 136, 136, 120]}
      emptyMessage="조건에 맞는 문의가 없습니다."
      isEmpty={!isLoading && tickets.length === 0}
      isLoading={isLoading}
      skeletonRowCount={10}
    >
      <Table.Head>
        <Table.Row>
          <Table.Header>
            <HeaderCheckbox
              checked={scope.isAllSelected}
              indeterminate={scope.isIndeterminate}
              onChange={() => selection.toggleAll()}
            />
          </Table.Header>
          <Table.Header>문의</Table.Header>
          <Table.Header>상태</Table.Header>
          <Table.Header>우선순위</Table.Header>
          <Table.Header>분류</Table.Header>
          <Table.Header>업데이트</Table.Header>
        </Table.Row>
      </Table.Head>

      <Table.Body isLoading={isLoading}>
        {tickets.map((ticket) => (
          <Table.Row
            interactive
            key={ticket.id}
            onClick={() => router.push(`/tickets/${ticket.id}`)}
            selected={selection.includes(ticket.id)}
          >
            <Table.Cell truncate={false}>
              <input
                aria-label={`${ticket.title} 선택`}
                checked={selection.includes(ticket.id)}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                onChange={() => selection.toggle(ticket.id)}
                onClick={(event) => event.stopPropagation()}
                type="checkbox"
              />
            </Table.Cell>
            <Table.Cell truncate={false}>
              <div>
                <p className="line-clamp-1 font-bold text-ink">
                  {ticket.title}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {ticket.customerName} · {ticket.customerEmail}
                </p>
              </div>
            </Table.Cell>
            <Table.Cell>
              <StatusBadge status={ticket.status} />
            </Table.Cell>
            <Table.Cell>
              <PriorityBadge priority={ticket.priority} />
            </Table.Cell>
            <Table.Cell>
              <CategoryBadge category={ticket.category} />
            </Table.Cell>
            <Table.Cell>
              <span className="text-xs font-semibold text-muted">
                {formatDateTime(ticket.updatedAt)}
              </span>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

function HeaderCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      checked={checked}
      className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 align-bottom"
      onChange={onChange}
      type="checkbox"
    />
  );
}
