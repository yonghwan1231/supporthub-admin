"use client";

import { useEffect } from "react";
import {
  createUrlState,
  urlEnum,
  urlNumber,
  urlString,
  useObjectState,
  usePagination,
  useSelection,
} from "@jyh-dev/kit";
import { Button } from "@/common/components/ui/button";
import { Select } from "@/common/components/ui/field";
import { ListFilterBar } from "@/common/components/ui/list-filter-bar";
import { PaginationBar } from "@/common/components/ui/pagination-bar";
import { appModal } from "@/common/modals/app-modal";
import { TicketTable } from "@/tickets/components/ticket-table";
import { ticketService } from "@/tickets/services/ticket.service";
import type { ListFilterField } from "@/common/components/ui/list-filter-bar";

const ticketFilterFields: ListFilterField<
  "keyword" | "status" | "priority" | "sort"
>[] = [
  {
    label: "Status",
    name: "status",
    options: [
      { label: "전체", value: "all" },
      { label: "대기", value: "open" },
      { label: "처리중", value: "in_progress" },
      { label: "완료", value: "resolved" },
      { label: "보류", value: "hold" },
    ],
    type: "select",
  },
  {
    label: "Priority",
    name: "priority",
    options: [
      { label: "전체", value: "all" },
      { label: "낮음", value: "low" },
      { label: "보통", value: "medium" },
      { label: "높음", value: "high" },
      { label: "긴급", value: "urgent" },
    ],
    type: "select",
  },
  {
    label: "Sort",
    name: "sort",
    options: [
      { label: "최신순", value: "latest" },
      { label: "오래된순", value: "oldest" },
      { label: "우선순위순", value: "priority" },
    ],
    type: "select",
  },
  {
    className: "lg:min-w-80",
    label: "Search",
    name: "keyword",
    placeholder: "제목, 고객명, 이메일, 태그 검색",
    type: "search",
  },
];

export const ticketSearchState = createUrlState({
  namespace: "tickets",
  removeDefaults: true,
  schema: {
    page: urlNumber(1, { min: 1, integer: true }),
    size: urlNumber(10, { min: 5, max: 100, integer: true }),
    keyword: urlString("", { trim: true }),
    status: urlEnum(
      ["all", "open", "in_progress", "resolved", "hold"] as const,
      "all",
    ),
    priority: urlEnum(
      ["all", "low", "medium", "high", "urgent"] as const,
      "all",
    ),
    sort: urlEnum(["latest", "oldest", "priority"] as const, "latest"),
  },
});

export function TicketListPage() {
  const modal = appModal.useModal();
  const search = ticketSearchState.useUrlState();
  const draftSearch = useObjectState(search.state);
  const toolbar = useObjectState({
    bulkStatus: "in_progress" as $Ticket.Status,
  });
  const { data, isLoading, isFetching } = ticketService.queries.useGetTickets({
    placeholderData: (previousData) => previousData,
    variables: search.state,
  });

  const bulkUpdate = ticketService.mutations.useBulkUpdateStatus();

  const selection = useSelection<string>([], {
    scopeIds: data?.items.map((ticket) => ticket.id),
  });

  const pagination = usePagination({
    page: search.state.page,
    pageSize: search.state.size,
    totalItems: data?.meta.totalCount ?? 0,
    siblingCount: 1,
    boundaryCount: 1,
    onPageChange: (page) => {
      search.patch({ page }, { history: "push" });
    },
    onPageSizeChange: (size) => {
      search.patch({ page: 1, size }, { history: "push" });
    },
  });

  const runBulkUpdate = async () => {
    if (selection.count === 0) {
      return modal.alert({
        title: "선택한 문의가 없습니다.",
        description: "상태를 변경할 문의를 먼저 선택해주세요.",
      });
    }

    const ok = await modal.confirm({
      title: "문의 상태를 변경할까요?",
      description: `선택한 ${selection.count}개 문의의 상태를 일괄 변경합니다.`,
      confirmText: "변경",
      cancelText: "취소",
      confirmButton: {
        loadingText: "변경 중",
        action: async () => {
          await bulkUpdate.mutateAsync({
            ids: selection.selected,
            status: toolbar.state.bulkStatus,
          });
        },
      },
    });
    if (ok) selection.clear();
  };

  const openCreateTicketModal = async () => {
    const result = await modal.open("CreateTicketModal");
    if (!result.ok) return;

    await modal.alert({
      title: "문의가 생성되었습니다.",
      description: `"${result.value.title}" 문의가 대기 상태로 등록되었습니다.`,
    });
  };

  useEffect(() => {
    draftSearch.reset(search.state);
  }, [search.urlSearch]);

  return (
    <section className="page">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">고객 문의 관리</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            검색, 필터, 페이지네이션, 선택, 일괄 처리 흐름을 @jyh-dev/kit
            기반으로 구성한 헬프데스크 어드민입니다.
          </p>
        </div>
        <Button
          className="rainbow-border-button"
          onClick={() => void openCreateTicketModal()}
          variant="secondary"
        >
          문의 생성
        </Button>
      </header>

      <ListFilterBar
        fields={ticketFilterFields}
        value={draftSearch.state}
        onChange={(patch) => draftSearch.patch({ ...patch, page: 1 })}
        onReset={() => search.reset()}
        onSubmit={() => search.patch(draftSearch.state)}
      />

      {selection.count > 0 && (
        <section className="flex flex-col gap-3 rounded-md bg-brand/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink font-semibold">
            {selection.count}개 선택
          </p>
          <div className="flex flex-wrap gap-2">
            <Select
              className="w-30 h-8"
              value={toolbar.state.bulkStatus}
              onChange={(event) =>
                toolbar.patch({
                  bulkStatus: event.target.value as $Ticket.Status,
                })
              }
            >
              <option value="in_progress">처리중</option>
              <option value="resolved">완료</option>
              <option value="hold">보류</option>
              <option value="open">대기</option>
            </Select>
            <Button
              disabled={bulkUpdate.isPending}
              onClick={runBulkUpdate}
              type="button"
              className="h-8 text-sm"
            >
              상태 변경
            </Button>
            <Button
              disabled={selection.count === 0}
              onClick={() => selection.clear()}
              type="button"
              variant="secondary"
              className="h-8 text-sm"
            >
              전체 해제
            </Button>
          </div>
        </section>
      )}

      <div className="rounded-md border border-line overflow-hidden">
        <TicketTable
          isLoading={isLoading || isFetching}
          selection={selection}
          tickets={data?.items ?? []}
        />
      </div>

      <PaginationBar
        pagination={pagination}
        totalCount={data?.meta?.totalCount ?? 0}
      />
    </section>
  );
}
