"use client";

import {
  functionalUpdate,
  type OnChangeFn,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  apiSortToSortingState,
  sortingStateToApi,
} from "@/features/timesheets/list-sort-mapping";
import {
  getPresetBounds,
  type DateRangePresetValue,
} from "@/features/timesheets/date-range-presets";
import { useTimesheetListQuery } from "@/features/timesheets/use-timesheet-list";
import type { TimesheetUiStatus } from "@/lib/timesheets/week-status";
import type { TimesheetListSortField } from "@/types/timesheet";

import { TimesheetsDataTable } from "@/components/timesheets/timesheets-data-table";
import { TimesheetsPagination } from "@/components/timesheets/timesheets-pagination";
import { TimesheetsToolbar } from "@/components/timesheets/timesheets-toolbar";

export function TimesheetsDashboard() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [status, setStatus] = useState<TimesheetUiStatus | "all">("all");
  const [datePreset, setDatePreset] = useState<DateRangePresetValue>("all");
  const [sortBy, setSortBy] = useState<TimesheetListSortField>("week");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const dateBounds = useMemo(() => getPresetBounds(datePreset), [datePreset]);

  const queryInput = useMemo(
    () => ({
      page,
      pageSize,
      status,
      from: dateBounds.from,
      to: dateBounds.to,
      sortBy,
      sortDir,
    }),
    [page, pageSize, status, dateBounds, sortBy, sortDir],
  );

  const { data, isLoading, isError, error } = useTimesheetListQuery(queryInput);

  const sorting = useMemo(
    () => apiSortToSortingState(sortBy, sortDir),
    [sortBy, sortDir],
  );

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = functionalUpdate(updater, sorting);
    const api = sortingStateToApi(next);
    setSortBy(api.sortBy);
    setSortDir(api.sortDir);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Your Timesheets
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Review weekly submissions and open a week to edit tasks.
            </p>
          </div>

          <TimesheetsToolbar
            datePreset={datePreset}
            onDatePresetChange={(value) => {
              setDatePreset(value);
              setPage(1);
            }}
            status={status}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          />

          {isError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error instanceof Error ? error.message : "Something went wrong."}
            </p>
          ) : null}

          <TimesheetsDataTable
            data={data?.items ?? []}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            isLoading={isLoading}
          />

          {data && data.total > 0 ? (
            <TimesheetsPagination
              page={data.page}
              pageSize={data.pageSize}
              total={data.total}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
