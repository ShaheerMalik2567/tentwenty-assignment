"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchWeekDetail,
  weekDetailQueryKey,
} from "@/features/timesheets/timesheet-queries";

export function useWeekDetailQuery(weekId: string | undefined) {
  return useQuery({
    queryKey: weekDetailQueryKey(weekId ?? ""),
    queryFn: () => fetchWeekDetail(weekId!),
    enabled: Boolean(weekId),
  });
}
