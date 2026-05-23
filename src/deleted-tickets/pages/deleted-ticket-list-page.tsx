"use client";

import { createUrlState, urlNumber, usePagination } from "@jyh-dev/kit";
import { PaginationBar } from "@/common/components/ui/pagination-bar";
import { DeletedTicketTable } from "@/deleted-tickets/components/deleted-ticket-table";
import {
  useDeletedTicketAccessGate,
  useDeletedTicketUnauthorizedHandler,
} from "@/deleted-tickets/hooks/use-deleted-ticket-access";
import { deletedTicketService } from "@/deleted-tickets/services/deleted-ticket.service";

export const deletedTicketSearchState = createUrlState({
  namespace: "deletedTickets",
  removeDefaults: true,
  schema: {
    page: urlNumber(1, { integer: true, min: 1 }),
    size: urlNumber(10, { integer: true, max: 100, min: 5 }),
  },
});

export function DeletedTicketListPage() {
  const search = deletedTicketSearchState.useUrlState();
  const { password } = useDeletedTicketAccessGate();
  const { data, error, isError, isLoading } =
    deletedTicketService.queries.useGetDeletedTickets({
      enabled: Boolean(password),
      retry: false,
      variables: {
        page: search.state.page,
        password: password ?? "",
        size: search.state.size,
      },
    });

  useDeletedTicketUnauthorizedHandler(error);

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

  return (
    <section className="page">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">삭제된 문의</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            삭제 처리된 문의 원본 스냅샷을 별도 컬렉션에서 확인합니다. 데이터
            초기화에는 영향을 받지 않습니다.
          </p>
        </div>
      </header>

      {!isLoading && isError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          삭제된 문의 목록을 불러오지 못했습니다.
        </div>
      ) : null}

      <div className="overflow-hidden rounded-md border border-line">
        <DeletedTicketTable
          deletedTickets={data?.items ?? []}
          isLoading={!password || isLoading}
        />
      </div>

      <PaginationBar
        pagination={pagination}
        totalCount={data?.meta?.totalCount ?? 0}
      />
    </section>
  );
}
