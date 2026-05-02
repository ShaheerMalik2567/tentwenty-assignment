import { formatWeekDateRangeDisplay } from "@/lib/timesheets/format-week-range";
import {
  getTimesheetUiStatus,
  type TimesheetUiStatus,
} from "@/lib/timesheets/week-status";
import type { TimesheetEntry, TimesheetWeek } from "@/server/mock/types";
import { getStore } from "@/server/mock/store";
import type { TimesheetListRow, TimesheetListSortField } from "@/types/timesheet";

function sumHoursForWeek(entries: TimesheetEntry[], weekId: string): number {
  return entries
    .filter((e) => e.weekId === weekId)
    .reduce((acc, e) => acc + e.hours, 0);
}

/** Stable ordering for status column when sorting. */
const STATUS_ORDER: Record<TimesheetUiStatus, number> = {
  missing: 0,
  incomplete: 1,
  completed: 2,
};

function weekOverlapsRange(
  week: TimesheetWeek,
  fromIso: string | null,
  toIso: string | null,
): boolean {
  if (!fromIso && !toIso) return true;
  const from = fromIso ?? "0000-01-01";
  const to = toIso ?? "9999-12-31";
  return week.startDate <= to && week.endDate >= from;
}

export function buildTimesheetListRows(): TimesheetListRow[] {
  const { weeks, entries } = getStore();
  return weeks.map((w) => {
    const totalHours = sumHoursForWeek(entries, w.id);
    const status = getTimesheetUiStatus(totalHours);
    return {
      id: w.id,
      weekNumber: w.weekNumber,
      dateRangeLabel: formatWeekDateRangeDisplay(w.startDate, w.endDate),
      status,
      totalHours,
    };
  });
}

type RowWithWeekStart = TimesheetListRow & { weekStart: string };

export type ListQueryParams = {
  status: TimesheetUiStatus | "all";
  dateFrom: string | null;
  dateTo: string | null;
  sortBy: TimesheetListSortField;
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
};

export function queryTimesheetList(params: ListQueryParams): {
  items: TimesheetListRow[];
  total: number;
} {
  const store = getStore();
  const weekById = new Map(store.weeks.map((w) => [w.id, w]));

  const enriched: RowWithWeekStart[] = buildTimesheetListRows().map((row) => ({
    ...row,
    weekStart: weekById.get(row.id)?.startDate ?? "",
  }));

  const filtered = enriched.filter((row) => {
    if (params.status !== "all" && row.status !== params.status) return false;
    const week = weekById.get(row.id);
    if (!week) return false;
    return weekOverlapsRange(week, params.dateFrom, params.dateTo);
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = params.sortDir === "asc" ? 1 : -1;
    if (params.sortBy === "week") {
      return (a.weekNumber - b.weekNumber) * dir;
    }
    if (params.sortBy === "status") {
      const diff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (diff !== 0) return diff * dir;
      return (a.weekNumber - b.weekNumber) * dir;
    }
    return a.weekStart.localeCompare(b.weekStart) * dir;
  });

  const total = sorted.length;
  const start = (params.page - 1) * params.pageSize;
  const items: TimesheetListRow[] = sorted
    .slice(start, start + params.pageSize)
    .map(
      (row): TimesheetListRow => ({
        id: row.id,
        weekNumber: row.weekNumber,
        dateRangeLabel: row.dateRangeLabel,
        status: row.status,
        totalHours: row.totalHours,
      }),
    );

  return { items, total };
}
