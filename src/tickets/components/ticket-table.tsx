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
        root: "h-full bg-panel",
        head: "sticky top-0 z-10 bg-slate-50 text-xs text-muted shadow-[0_1px_0_0_#e2e8f0]",
        header: "py-2.5 h-auto",
        cell: "py-2.5 h-auto",
        skeletonRow: "h-auto p-0",
        skeletonBar: "h-3",
        skeletonCell: "h-auto p-4",
      }}
      colgroup={[52, 80, "auto", 100, 100, 100, 180]}
      emptyMessage="조건에 맞는 문의가 없습니다."
      isEmpty={!isLoading && tickets.length === 0}
      isLoading={isLoading}
      skeletonRowCount={10}
    >
      <Table.Head>
        <Table.Row withDivider={false}>
          <Table.Header align="center">
            <HeaderCheckbox
              checked={scope.isAllSelected}
              indeterminate={scope.isIndeterminate}
              onChange={() => selection.toggleAll()}
            />
          </Table.Header>
          <Table.Header>분류</Table.Header>
          <Table.Header>문의</Table.Header>
          <Table.Header>이름</Table.Header>
          <Table.Header>상태</Table.Header>
          <Table.Header>우선순위</Table.Header>
          <Table.Header>업데이트</Table.Header>
        </Table.Row>
      </Table.Head>

      <Table.Body>
        {tickets.map((ticket) => (
          <Table.Row
            interactive
            key={ticket.id}
            onClick={() => router.push(`/tickets/${ticket.id}`)}
            selected={selection.includes(ticket.id)}
          >
            <Table.Cell truncate={false} align="center">
              <input
                aria-label={`${ticket.title} 선택`}
                checked={selection.includes(ticket.id)}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 align-sub"
                onChange={() => selection.toggle(ticket.id)}
                onClick={(event) => event.stopPropagation()}
                type="checkbox"
              />
            </Table.Cell>
            <Table.Cell>
              <CategoryBadge category={ticket.category} />
            </Table.Cell>
            <Table.Cell>{ticket.title}</Table.Cell>
            <Table.Cell>{ticket.customerName}</Table.Cell>
            <Table.Cell>
              <StatusBadge status={ticket.status} />
            </Table.Cell>
            <Table.Cell>
              <PriorityBadge priority={ticket.priority} />
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
