import { queryOptions } from "@tanstack/react-query";

import type { TimesheetUiStatus } from "@/lib/timesheets/timesheet-utils";
import type {
  TimesheetListResponse,
  TimesheetListSortField,
  TimesheetWeekDetailResponse,
} from "@/types/timesheet";

export type TimesheetListQueryInput = {
  page: number;
  pageSize: number;
  status: TimesheetUiStatus | "all";
  from: string | null;
  to: string | null;
  sortBy: TimesheetListSortField;
  sortDir: "asc" | "desc";
};

export function timesheetsListQueryKey(input: TimesheetListQueryInput) {
  return ["timesheets", "list", input] as const;
}

async function fetchTimesheetList(
  input: TimesheetListQueryInput,
): Promise<TimesheetListResponse> {
  const params = new URLSearchParams();
  params.set("page", String(input.page));
  params.set("pageSize", String(input.pageSize));
  params.set("status", input.status);
  if (input.from) params.set("from", input.from);
  if (input.to) params.set("to", input.to);
  params.set("sortBy", input.sortBy);
  params.set("sortDir", input.sortDir);

  const res = await fetch(`/api/timesheets?${params.toString()}`);
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Could not load timesheets.");
  return res.json() as Promise<TimesheetListResponse>;
}

/** Use with `useQuery(getTimesheetListQuery(input))`. */
export function getTimesheetListQuery(input: TimesheetListQueryInput) {
  return queryOptions({
    queryKey: timesheetsListQueryKey(input),
    queryFn: () => fetchTimesheetList(input),
  });
}

export function weekDetailQueryKey(weekId: string) {
  return ["timesheets", "detail", weekId] as const;
}

async function fetchWeekDetail(
  weekId: string,
): Promise<TimesheetWeekDetailResponse> {
  const res = await fetch(`/api/timesheets/${weekId}`);
  if (res.status === 401) throw new Error("Unauthorized");
  if (res.status === 404) throw new Error("Week not found.");
  if (!res.ok) throw new Error("Could not load week.");
  return res.json() as Promise<TimesheetWeekDetailResponse>;
}

/** Use with `useQuery(getWeekDetailQuery(weekId))`. Disabled when `weekId` is falsy. */
export function getWeekDetailQuery(weekId: string | undefined) {
  return queryOptions({
    queryKey: weekDetailQueryKey(weekId ?? ""),
    queryFn: () => fetchWeekDetail(weekId!),
    enabled: Boolean(weekId),
  });
}
