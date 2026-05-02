"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchTimesheetList,
  timesheetsListQueryKey,
  type TimesheetListQueryInput,
} from "@/features/timesheets/timesheet-queries";

export function useTimesheetListQuery(input: TimesheetListQueryInput) {
  return useQuery({
    queryKey: timesheetsListQueryKey(input),
    queryFn: () => fetchTimesheetList(input),
  });
}
