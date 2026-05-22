"use client";

import { useEffect } from "react";
import {
  createUrlState,
  urlEnum,
  urlNumber,
  urlString,
  useAsyncAction,
  useObjectState,
  usePagination,
  usePromiseModal,
  useSelection,
} from "@jyh-dev/kit";
import { Search } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Input, Select } from "@/common/components/ui/field";
import { PaginationBar } from "@/common/components/ui/pagination-bar";
import { TicketTable } from "@/tickets/components/ticket-table";
import { ticketService } from "@/tickets/services/ticket.service";

export const ticketSearchState = createUrlState({
  namespace: "tickets",
  removeDefaults: true,
  schema: {
    page: urlNumber(1, { min: 1, integer: true }),
    size: urlNumber(20, { min: 5, max: 100, integer: true }),
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
  const modal = usePromiseModal();
  const search = ticketSearchState.useUrlState();
  const draftSearch = useObjectState(search.state);
  const toolbar = useObjectState({
    bulkStatus: "in_progress" as $Ticket.Status,
    filtersOpen: true,
  });
  const ticketsQuery = ticketService.queries.useGetTickets({
    variables: search.state,
  });

  const bulkUpdate = ticketService.mutations.useBulkUpdateStatus();
  const tickets = ticketsQuery.data?.items ?? [];
  const meta = ticketsQuery.data?.meta;
  const isTableLoading = ticketsQuery.isLoading || ticketsQuery.isFetching;
  const selection = useSelection<string>([], {
    scopeIds: tickets.map((ticket) => ticket.id),
  });
  const pagination = usePagination({
    page: search.state.page,
    pageSize: search.state.size,
    totalItems: meta?.totalCount ?? 0,
    siblingCount: 1,
    boundaryCount: 1,
    onPageChange: (page) => {
      search.patch({ page }, { history: "push" });
    },
    onPageSizeChange: (size) => {
      search.patch({ page: 1, size }, { history: "push" });
    },
  });

  const bulkAction = useAsyncAction<[$Ticket.Status], void>({
    action: async ({ args }) => {
      const [status] = args;
      await bulkUpdate.mutateAsync({
        ids: selection.selected,
        status,
      });
      selection.clear();
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
      content: <div className="absolute inset-0">로딩스피너</div>,
    });
    if (!ok) return;

    const result = await bulkAction.run(toolbar.state.bulkStatus);
    if (!result.ok) {
      await modal.alert({
        title: "상태 변경 실패",
        description: result.error.message,
      });
    }
  };

  useEffect(() => {
    draftSearch.reset(search.state);
  }, [search.urlSearch]);

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-bold text-ink">고객 문의 관리</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            검색, 필터, 페이지네이션, 선택, 일괄 처리 흐름을 @jyh-dev/kit
            기반으로 구성한 헬프데스크 어드민입니다.
          </p>
        </div>
      </header>

      {toolbar.state.filtersOpen ? (
        <section className="rounded-md border border-line bg-panel p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex gap-3">
              <label className="w-30">
                <span className="mb-1.5 block text-xs font-bold uppercase text-muted">
                  Status
                </span>
                <Select
                  value={draftSearch.state.status}
                  onChange={(event) =>
                    draftSearch.patch({
                      status: event.target.value as typeof search.state.status,
                      page: 1,
                    })
                  }
                >
                  <option value="all">전체</option>
                  <option value="open">대기</option>
                  <option value="in_progress">처리중</option>
                  <option value="resolved">완료</option>
                  <option value="hold">보류</option>
                </Select>
              </label>

              <label className="w-30">
                <span className="mb-1.5 block text-xs font-bold uppercase text-muted">
                  Priority
                </span>
                <Select
                  value={draftSearch.state.priority}
                  onChange={(event) =>
                    draftSearch.patch({
                      priority: event.target
                        .value as typeof search.state.priority,
                      page: 1,
                    })
                  }
                >
                  <option value="all">전체</option>
                  <option value="low">낮음</option>
                  <option value="medium">보통</option>
                  <option value="high">높음</option>
                  <option value="urgent">긴급</option>
                </Select>
              </label>

              <label className="w-30">
                <span className="mb-1.5 block text-xs font-bold uppercase text-muted">
                  Sort
                </span>
                <Select
                  value={draftSearch.state.sort}
                  onChange={(event) =>
                    draftSearch.patch({
                      sort: event.target.value as typeof search.state.sort,
                      page: 1,
                    })
                  }
                >
                  <option value="latest">최신순</option>
                  <option value="oldest">오래된순</option>
                  <option value="priority">우선순위순</option>
                </Select>
              </label>
            </div>
            <label className="grow max-w-100">
              <span className="mb-1.5 block text-xs font-bold uppercase text-muted">
                Search
              </span>
              <span className="relative block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={16}
                />
                <Input
                  className="pl-9"
                  placeholder="제목, 고객명, 이메일, 태그 검색"
                  value={draftSearch.state.keyword}
                  onChange={(event) =>
                    draftSearch.patch({
                      keyword: event.target.value,
                      page: 1,
                    })
                  }
                />
              </span>
            </label>

            <Button
              className="self-end w-20"
              onClick={() => search.patch(draftSearch.state)}
              type="button"
            >
              검색
            </Button>
            <Button
              className="self-end w-20"
              onClick={() => search.reset()}
              type="button"
              variant="ghost"
            >
              초기화
            </Button>
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-3 rounded-md  bg-brand/10 py-3 px-4 sm:flex-row sm:items-center sm:justify-between">
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
            disabled={bulkAction.isLoading}
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

      <div className="rounded-md">
        <TicketTable
          isLoading={isTableLoading}
          selection={selection}
          tickets={tickets}
        />
        <PaginationBar
          pagination={pagination}
          totalCount={meta?.totalCount ?? 0}
        />
      </div>
    </section>
  );
}
