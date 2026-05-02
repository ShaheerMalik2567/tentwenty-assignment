"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { buildPaginationItems } from "@/lib/timesheets/pagination-pages";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimesheetsPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange: (nextSize: number) => void;
};

export function TimesheetsPagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: TimesheetsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const items = buildPaginationItems(current, totalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-neutral-600">
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger className="h-9 w-[120px] border-neutral-200 bg-white">
            <SelectValue />
            <span className="sr-only">per page</span>
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
          className={cn(
            "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 shadow-sm transition-colors",
            "hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <ChevronLeft className="size-4" />
          Previous
        </button>

        {items.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`e-${idx}`}
              className="inline-flex min-w-9 items-center justify-center px-1 text-sm text-neutral-500"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                item === current
                  ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                  : "border-transparent bg-white text-neutral-700 hover:border-neutral-200 hover:bg-neutral-50",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={current >= totalPages}
          onClick={() => onPageChange(current + 1)}
          className={cn(
            "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 shadow-sm transition-colors",
            "hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
