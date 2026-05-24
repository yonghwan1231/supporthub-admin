"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Select } from "@/common/components/ui/field";
import type { PaginationController } from "@jyh-dev/kit";

export function PaginationBar({
  pagination,
  totalCount,
}: {
  pagination: PaginationController;
  totalCount: number;
}) {
  return (
    <div className="flex gap-3 px-4 py-4 items-center justify-between">
      <p className="text-sm text-muted">
        총 <span className="font-bold text-ink">{totalCount}</span>건
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          aria-label="페이지 크기"
          className="w-28"
          value={pagination.pageSize}
          onChange={(event) =>
            pagination.setPageSize(Number(event.target.value))
          }
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}개씩
            </option>
          ))}
        </Select>

        <Button
          aria-label="처음"
          disabled={!pagination.canPrevious}
          onClick={pagination.first}
          type="button"
          variant="ghost"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          aria-label="이전"
          disabled={!pagination.canPrevious}
          onClick={pagination.previous}
          type="button"
          variant="ghost"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pagination.items.map((item) => {
          if (item.type === "ellipsis") {
            return (
              <Button
                key={item.key}
                onClick={() => pagination.setPage(item.targetPage)}
                type="button"
                variant="ghost"
              >
                ...
              </Button>
            );
          }

          return (
            <Button
              aria-current={item.selected ? "page" : undefined}
              key={item.key}
              onClick={() => pagination.setPage(item.page)}
              type="button"
              variant={item.selected ? "primary" : "secondary"}
              className="h-8 w-8 text-xs"
            >
              {item.page}
            </Button>
          );
        })}

        <Button
          aria-label="다음"
          disabled={!pagination.canNext}
          onClick={pagination.next}
          type="button"
          variant="ghost"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          aria-label="마지막"
          disabled={!pagination.canNext}
          onClick={pagination.last}
          type="button"
          variant="ghost"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
