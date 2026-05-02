import type {
  TimesheetListResponse,
  TimesheetListSortField,
  TimesheetWeekDetailResponse,
} from "@/types/timesheet";
import type { TimesheetUiStatus } from "@/lib/timesheets/week-status";

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

export async function fetchTimesheetList(
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

export function weekDetailQueryKey(weekId: string) {
  return ["timesheets", "detail", weekId] as const;
}

export async function fetchWeekDetail(
  weekId: string,
): Promise<TimesheetWeekDetailResponse> {
  const res = await fetch(`/api/timesheets/${weekId}`);
  if (res.status === 401) throw new Error("Unauthorized");
  if (res.status === 404) throw new Error("Week not found.");
  if (!res.ok) throw new Error("Could not load week.");
  return res.json() as Promise<TimesheetWeekDetailResponse>;
}
