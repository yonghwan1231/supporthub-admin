"use client";

import { Table } from "@jyh-dev/kit";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/common/lib/format";
import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/tickets/components/ticket-badges";

export function DeletedTicketTable({
  deletedTickets,
  isLoading,
}: {
  deletedTickets: $DeletedTicket.ListItem[];
  isLoading: boolean;
}) {
  const router = useRouter();

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
      colgroup={[80, "auto", 100, 100, 100, 160, 180]}
      emptyMessage="삭제된 문의가 없습니다."
      isEmpty={!isLoading && deletedTickets.length === 0}
      isLoading={isLoading}
      skeletonRowCount={10}
    >
      <Table.Head>
        <Table.Row withDivider={false}>
          <Table.Header>분류</Table.Header>
          <Table.Header>문의</Table.Header>
          <Table.Header>이름</Table.Header>
          <Table.Header>상태</Table.Header>
          <Table.Header>우선순위</Table.Header>
          <Table.Header>삭제 일시</Table.Header>
          <Table.Header>업데이트</Table.Header>
        </Table.Row>
      </Table.Head>

      <Table.Body>
        {deletedTickets.map((ticket) => (
          <Table.Row
            interactive
            key={ticket.id}
            onClick={() => router.push(`/deleted-tickets/${ticket.id}`)}
          >
            <Table.Cell>
              <CategoryBadge category={ticket.category} />
            </Table.Cell>
            <Table.Cell>
              <span className="block truncate">{ticket.title}</span>
              <span className="mt-1 block truncate text-xs font-semibold text-muted">
                원본 ID {ticket.originalId}
              </span>
            </Table.Cell>
            <Table.Cell>{ticket.customerName}</Table.Cell>
            <Table.Cell>
              <StatusBadge status={ticket.status} />
            </Table.Cell>
            <Table.Cell>
              <PriorityBadge priority={ticket.priority} />
            </Table.Cell>
            <Table.Cell>
              <span className="text-xs font-semibold text-muted">
                {formatDateTime(ticket.deletedAt)}
              </span>
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
