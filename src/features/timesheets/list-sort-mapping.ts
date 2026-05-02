import type { SortingState } from "@tanstack/react-table";

import type { TimesheetListSortField } from "@/types/timesheet";

/** TanStack column ids that map to API `sortBy` fields. */
export const COLUMN_IDS = {
  weekNumber: "weekNumber",
  dateRangeLabel: "dateRangeLabel",
  status: "status",
} as const;

export function apiSortToSortingState(
  sortBy: TimesheetListSortField,
  sortDir: "asc" | "desc",
): SortingState {
  const id =
    sortBy === "week"
      ? COLUMN_IDS.weekNumber
      : sortBy === "date"
        ? COLUMN_IDS.dateRangeLabel
        : COLUMN_IDS.status;
  return [{ id, desc: sortDir === "desc" }];
}

export function sortingStateToApi(sorting: SortingState): {
  sortBy: TimesheetListSortField;
  sortDir: "asc" | "desc";
} {
  const first = sorting[0];
  if (!first) return { sortBy: "week", sortDir: "desc" };

  const sortBy: TimesheetListSortField =
    first.id === COLUMN_IDS.weekNumber
      ? "week"
      : first.id === COLUMN_IDS.dateRangeLabel
        ? "date"
        : "status";

  return { sortBy, sortDir: first.desc ? "desc" : "asc" };
}
